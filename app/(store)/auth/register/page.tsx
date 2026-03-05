"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { GoogleLoginButton } from "@/components/google-login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register("/api/auth/customer/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setError("");
    setLoading(true);
    try {
      await googleLogin(credential, "customer");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4 py-12">
      <Link href="/" className="mb-8">
        <Image src="/images/logo.png" alt="ItenGear" width={160} height={56} className="h-14 w-auto" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-xl border border-border shadow-sm p-8">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">Create Your Account</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Join ItenGear and start shopping</p>

        {error && (
          <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-foreground">First Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="firstName" placeholder="John" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required className="pl-10" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required className="pl-10" />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phone" type="tel" placeholder="0700000000" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="pl-10" />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} required className="pl-10 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="pl-10" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-muted-foreground">OR</span></div>
        </div>

        <GoogleLoginButton onCredentialResponse={handleGoogleCredential} text="signup_with" />

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-ig-green font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
