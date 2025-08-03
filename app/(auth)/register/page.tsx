import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/");
  
  return (
    <section className="flex fixed top-0 right-0 left-0 h-screen w-screen overflow-hidden flex-col items-center justify-center bg-background/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg border p-6 shadow-sm md:p-12 mt-12 bg-muted">
        <Image
          className="mb-8 dark:invert"
          src="/icon.svg"
          alt="logo"
          width={50}
          height={72}
        />
        <p className="text-center text-xl">Create Account</p>
        <div className="rounded-md border border-yellow-500 border-dashed"></div>
        <p className="text-center text-muted-foreground">
          Sign up for Headless Form
        </p>
        <div className="flex flex-col items-center w-full gap-2">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
      <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground md:mb-24">
        By using Headless Form, you agree to our{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://router.so/privacy"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://router.so/terms"
        >
          Terms of Service
        </a>
        .
      </p>
    </section>
  );
}