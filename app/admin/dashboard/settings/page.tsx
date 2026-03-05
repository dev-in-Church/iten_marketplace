"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings, Globe, CreditCard, Bell, Shield, Check, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "ItenGear",
    siteUrl: "https://itengear.com",
    supportEmail: "support@itengear.com",
    commissionRate: "10",
    mpesaShortcode: "174379",
    mpesaPasskey: "",
    enableNewVendors: true,
    enableMpesa: true,
    maintenanceMode: false,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // simulated
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {saved && (
        <div className="bg-ig-green-light text-ig-green text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        {/* General */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground text-sm">Site Name</Label>
              <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground text-sm">Site URL</Label>
              <Input value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground text-sm">Support Email</Label>
              <Input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Payment Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground text-sm">Commission Rate (%)</Label>
              <Input type="number" value={settings.commissionRate} onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Percentage of each sale taken as platform commission.</p>
            </div>
            <div>
              <Label className="text-foreground text-sm">M-Pesa Shortcode</Label>
              <Input value={settings.mpesaShortcode} onChange={(e) => setSettings({ ...settings, mpesaShortcode: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground text-sm">M-Pesa Passkey</Label>
              <Input type="password" value={settings.mpesaPasskey} onChange={(e) => setSettings({ ...settings, mpesaPasskey: e.target.value })} className="mt-1" placeholder="Enter passkey..." />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Feature Toggles</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "enableNewVendors" as const, label: "Allow New Vendor Registrations", desc: "Enable or disable new vendor signups", icon: Bell },
              { key: "enableMpesa" as const, label: "Enable M-Pesa Payments", desc: "Toggle M-Pesa payment gateway", icon: CreditCard },
              { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Take the site offline for maintenance", icon: Shield },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <toggle.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                    <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings[toggle.key] ? "bg-ig-green" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[toggle.key] ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={saving} className="bg-ig-red hover:bg-ig-red/90 text-white font-semibold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
