import { ImageResponse } from "next/og";

// Same orange cube as LogoIcon – base64 SVG data URL (works in Node + Edge)
const CUBE_B64 =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBvbHlnb24gcG9pbnRzPSIxMS4xOSAxMS4zNSAxNS43NSAzLjUxIDYuNzUgMy41MSAyLjI1IDExLjM1IDExLjE5IDExLjM1IiBmaWxsPSIjZjk3MzE2Ii8+PHBvbHlnb24gcG9pbnRzPSIyLjI1IDEyLjY1IDYuNzQgMjAuNDkgMTUuNzMgMjAuNDkgMTEuMjUgMTIuNjUgMi4yNSAxMi42NSIgZmlsbD0iI2VhNTgwYyIvPjxwYXRoIGQ9Ik0yMS43NSwxMmwtNC41LTcuODdMMTIuNzQsMTJsNC41MSw3Ljg3WiIgZmlsbD0iI2MyNDEwYyIvPjwvc3ZnPg==";
const CUBE_DATA_URL = `data:image/svg+xml;base64,${CUBE_B64}`;

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CUBE_DATA_URL} alt="" width={32} height={32} />
      </div>
    ),
    { ...size }
  );
}
