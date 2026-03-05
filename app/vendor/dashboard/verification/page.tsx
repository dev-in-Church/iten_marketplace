"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BadgeCheck,
  Upload,
  AlertCircle,
  Clock,
  Check,
  Loader2,
  FileText,
} from "lucide-react";

export default function VendorVerificationPage() {
  const { vendor, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    businessRegNumber: "",
    kraPin: "",
    physicalAddress: "",
    contactPhone: "",
  });

  const isVerified = vendor?.is_verified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/vendor/verify-request", form);
      setSuccess(true);
      await refreshUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (isVerified) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Verification</h1>
        <div className="max-w-lg bg-ig-green-light border border-ig-green/20 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-ig-green/10 mx-auto mb-4 flex items-center justify-center">
            <BadgeCheck className="h-8 w-8 text-ig-green" />
          </div>
          <h2 className="text-xl font-bold text-ig-green mb-2">Store Verified</h2>
          <p className="text-sm text-muted-foreground">
            Your store has been verified. Customers can see your verified badge.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Verification</h1>
        <div className="max-w-lg bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-amber-800 mb-2">Verification Pending</h2>
          <p className="text-sm text-amber-700">
            Your documents have been submitted. Admin will review within 1-3 business days.
            You can also subscribe to get instant verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Verification</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Get your store verified to build customer trust. You can either submit your business documents for admin review or subscribe for instant verification.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Document verification */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Document Verification</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Submit your business details for admin review. Free but takes 1-3 days.
          </p>

          {error && (
            <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-foreground text-sm">Registered Business Name</Label>
              <Input
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="e.g., SportsTech Ltd"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground text-sm">Business Registration Number</Label>
              <Input
                required
                value={form.businessRegNumber}
                onChange={(e) => setForm({ ...form, businessRegNumber: e.target.value })}
                placeholder="e.g., PVT-12345678"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground text-sm">KRA PIN</Label>
              <Input
                required
                value={form.kraPin}
                onChange={(e) => setForm({ ...form, kraPin: e.target.value })}
                placeholder="e.g., A012345678Z"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground text-sm">Physical Address</Label>
              <Input
                required
                value={form.physicalAddress}
                onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
                placeholder="e.g., Kimathi Street, Nairobi"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground text-sm">Contact Phone</Label>
              <Input
                type="tel"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                placeholder="e.g., 0712345678"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-ig-green hover:bg-ig-green/90 text-white"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {submitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </form>
        </div>

        {/* Instant via subscription */}
        <div className="bg-white border-2 border-ig-green rounded-xl p-6 relative">
          <span className="absolute -top-3 right-4 bg-ig-green text-white text-[10px] font-bold px-3 py-1 rounded-full">
            INSTANT
          </span>
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="h-5 w-5 text-ig-green" />
            <h2 className="font-bold text-foreground">Subscribe & Verify</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Pay a monthly or yearly subscription to instantly verify your store and unlock premium features.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "Instant verification badge",
              "Priority in search results",
              "Analytics dashboard",
              "Customer support",
              "Featured store placement (yearly)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-ig-green shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Button
            asChild
            className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold"
          >
            <a href="/vendor/dashboard/subscription">View Plans</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
