import { SignupForm } from "@/components/signup-form"
import LogoIcon from "@/components/ui/logo"

export default function SignupPage() {
  return (
       <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-3 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <a href="#" className="flex justify-center items-center gap-1 self-center font-medium">
          <div className=" text-primary-foreground size-8 flex items-center justify-center rounded-md">
            <LogoIcon   />
          </div>
          Antiquity
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
