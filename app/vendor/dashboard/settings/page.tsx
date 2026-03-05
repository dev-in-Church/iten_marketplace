"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Store, User, AlertCircle, Check } from "lucide-react";

export default function VendorSettingsPage() {
  const { user, vendor, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [store, setStore] = useState({
    storeName: vendor?.store_name || "",
    storeDescription: vendor?.store_description || "",
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put("/api/vendor/profile", profile);
      setSaved(true);
      await refreshUser();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put("/api/vendor/store", store);
      setSaved(true);
      await refreshUser();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {error && (
        <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-ig-green-light text-ig-green text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          Settings saved successfully.
        </div>
      )}

      <div className="space-y-8 max-w-2xl">
        {/* Personal info */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Personal Information</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground text-sm">First Name</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground text-sm">Last Name</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground text-sm">Email</Label>
              <Input value={user?.email || ""} disabled className="mt-1 bg-muted text-muted-foreground" />
            </div>
            <div>
              <Label className="text-foreground text-sm">Phone</Label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving} className="bg-ig-green hover:bg-ig-green/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Profile
            </Button>
          </form>
        </div>

        {/* Store settings */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Store Settings</h2>
          </div>
          <form onSubmit={handleSaveStore} className="space-y-4">
            <div>
              <Label className="text-foreground text-sm">Store Name</Label>
              <Input
                value={store.storeName}
                onChange={(e) => setStore({ ...store, storeName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground text-sm">Store Description</Label>
              <textarea
                value={store.storeDescription}
                onChange={(e) => setStore({ ...store, storeDescription: e.target.value })}
                rows={4}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Tell customers about your store..."
              />
            </div>
            <Button type="submit" disabled={saving} className="bg-ig-green hover:bg-ig-green/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Store
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
