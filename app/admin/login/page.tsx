import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/marketing/Logo";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <Logo />
      <SignIn
        routing="hash"
        signUpUrl="/admin/login"
        fallbackRedirectUrl="/admin/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#c8ff3d",
            colorBackground: "#0b0e13",
            colorForeground: "#f5f7fa",
            colorMutedForeground: "#a6b0bf",
            colorInput: "#05070a",
            colorInputForeground: "#f5f7fa",
            borderRadius: "0.625rem",
          },
        }}
      />
    </div>
  );
}
