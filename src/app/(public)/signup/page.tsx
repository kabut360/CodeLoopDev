import { SignupForm } from "@/components/auth/SignupForm";
import { Logo } from "@/components/icons";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-headline font-bold tracking-tight">Create your CodeLoop Account</h1>
            <p className="mt-2 text-muted-foreground">Start turning your ideas into code in seconds.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
