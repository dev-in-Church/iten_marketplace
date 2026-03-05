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
import { Eye, EyeOff, Mail, Lock, User, Phone, Store } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const { login, register: registerFn, googleLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", storeName: "", storeDescription: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login("/api/auth/vendor/login", { email: form.email, password: form.password });
      router.push("/vendor/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!form.storeName) { setError("Store name is required"); return; }

    setLoading(true);
    try {
      await registerFn("/api/auth/vendor/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        storeName: form.storeName,
        storeDescription: form.storeDescription,
      });
      router.push("/vendor/dashboard");
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
      await googleLogin(credential, "vendor");
      router.push("/vendor/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ig-black px-4 py-12">
      <Link href="/" className="mb-8">
        <Image src="/images/logo.png" alt="ItenGear" width={160} height={56} className="h-14 w-auto" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-xl border border-border shadow-lg p-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${isLogin ? "border-ig-green text-ig-green" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Vendor Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${!isLogin ? "border-ig-green text-ig-green" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Register Store
          </button>
        </div>

        {error && (
          <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="vendor@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
              {loading ? "Signing in..." : "Sign In as Vendor"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-foreground">First Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div>
                <Label className="text-foreground">Last Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required className="pl-10" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-foreground">Store Name *</Label>
              <div className="relative mt-1.5">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Your Store Name" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Store Description</Label>
              <Input placeholder="What does your store sell?" value={form.storeDescription} onChange={(e) => update("storeDescription", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-foreground">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Phone</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="tel" placeholder="0700000000" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} required className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-foreground">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="pl-10" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
              {loading ? "Creating Store..." : "Create Vendor Account"}
            </Button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-muted-foreground">OR</span></div>
        </div>

        <GoogleLoginButton onCredentialResponse={handleGoogleCredential} text="signin_with" />

        <p className="text-xs text-center text-muted-foreground mt-4">
          <Link href="/" className="text-ig-green hover:underline">Back to Store</Link>
        </p>
      </div>
    </div>
  );
}
