import { Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user.role as "admin" | "user") || "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}