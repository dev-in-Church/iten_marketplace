"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, Heart, User, Settings, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login?redirect=/account");
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>;
  }

  const menuItems = [
    { href: "/account/orders", icon: Package, label: "My Orders", desc: "Track and manage your orders" },
    { href: "/account/wishlist", icon: Heart, label: "Wishlist", desc: "Products you have saved" },
    { href: "/account/profile", icon: Settings, label: "Profile Settings", desc: "Update your personal info" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ig-green flex items-center justify-center text-white text-xl font-bold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="bg-white border border-border rounded-lg p-5 hover:border-ig-green hover:shadow-md transition-all group">
            <item.icon className="h-8 w-8 text-ig-green mb-3" />
            <h3 className="font-semibold text-foreground group-hover:text-ig-green transition-colors">{item.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      <Button variant="outline" onClick={logout} className="gap-2 text-ig-red border-ig-red hover:bg-ig-red-light hover:text-ig-red">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
