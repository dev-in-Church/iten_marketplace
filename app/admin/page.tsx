"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login("/api/auth/admin/login", form);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ig-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="ItenGear"
            width={160}
            height={52}
            className="mx-auto h-12 w-auto brightness-0 invert"
          />
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="h-5 w-5 text-ig-red" />
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-foreground mb-1">Admin Login</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Access restricted to authorized administrators only.
          </p>

          {error && (
            <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-foreground text-sm font-medium">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="admin@itengear.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-foreground text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-ig-red hover:bg-ig-red/90 text-white font-semibold h-11"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          No signup available. Admin accounts are predefined.
        </p>
      </div>
    </div>
  );
}
