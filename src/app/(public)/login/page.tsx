import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/icons";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-headline font-bold tracking-tight">Welcome Back to CodeLoop</h1>
            <p className="mt-2 text-muted-foreground">Log in to continue your coding journey.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
