"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BadgeCheck, XCircle, Clock, Store, FileText, CheckCircle2 } from "lucide-react";

interface VerificationRequest {
  id: string;
  vendor_id: string;
  store_name: string;
  owner_name: string;
  business_name: string;
  business_reg_number: string;
  kra_pin: string;
  physical_address: string;
  contact_phone: string;
  status: string;
  created_at: string;
}

const MOCK_REQUESTS: VerificationRequest[] = [
  { id: "1", vendor_id: "v1", store_name: "Sprint Shoes KE", owner_name: "Anne Wanjiru", business_name: "Sprint Shoes Ltd", business_reg_number: "PVT-12345678", kra_pin: "A012345678Z", physical_address: "Kenyatta Ave, Nairobi", contact_phone: "0712345678", status: "pending", created_at: "2026-03-01" },
  { id: "2", vendor_id: "v2", store_name: "Ball Masters", owner_name: "Brian Oduor", business_name: "Ball Masters Ent.", business_reg_number: "PVT-87654321", kra_pin: "B987654321Y", physical_address: "Moi Avenue, Mombasa", contact_phone: "0723456789", status: "pending", created_at: "2026-02-28" },
  { id: "3", vendor_id: "v3", store_name: "GymTech Kenya", owner_name: "Faith Muthoni", business_name: "GymTech Ltd", business_reg_number: "PVT-11223344", kra_pin: "C112233445X", physical_address: "Tom Mboya St, Nairobi", contact_phone: "0734567890", status: "pending", created_at: "2026-02-27" },
];

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>(MOCK_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const data = await api.get<{ requests: VerificationRequest[] }>("/api/admin/verification-requests");
        if (data.requests?.length) setRequests(data.requests);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleApprove = async (id: string, vendorId: string) => {
    try {
      await api.put(`/api/admin/vendors/${vendorId}/verify`);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    } catch {
      // failed
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/api/admin/verification-requests/${id}/reject`);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    } catch {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const processed = requests.filter((r) => r.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Vendor Verification</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Review vendor verification requests. Approve or reject based on submitted documents.
      </p>

      {/* Pending */}
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        Pending Requests ({pending.length})
      </h2>

      {loading ? (
        <div className="space-y-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-6 animate-pulse">
              <div className="h-5 w-40 bg-muted rounded mb-2" />
              <div className="h-4 w-60 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center mb-8">
          <CheckCircle2 className="h-10 w-10 text-ig-green mx-auto mb-3" />
          <p className="text-foreground font-medium">All caught up!</p>
          <p className="text-sm text-muted-foreground">No pending verification requests.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map((r) => (
            <div key={r.id} className="bg-white border border-border rounded-xl overflow-hidden">
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{r.store_name}</p>
                    <p className="text-xs text-muted-foreground">Owned by {r.owner_name} | Applied {new Date(r.created_at).toLocaleDateString("en-KE")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-ig-green hover:bg-ig-green/90 text-white text-xs"
                    onClick={(e) => { e.stopPropagation(); handleApprove(r.id, r.vendor_id); }}
                  >
                    <BadgeCheck className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-ig-red border-ig-red/30 hover:bg-ig-red-light text-xs"
                    onClick={(e) => { e.stopPropagation(); handleReject(r.id); }}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
              {expandedId === r.id && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Business Name</p>
                      <p className="font-medium text-foreground flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {r.business_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Registration Number</p>
                      <p className="font-medium text-foreground">{r.business_reg_number}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">KRA PIN</p>
                      <p className="font-medium text-foreground">{r.kra_pin}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Contact Phone</p>
                      <p className="font-medium text-foreground">{r.contact_phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">Physical Address</p>
                      <p className="font-medium text-foreground">{r.physical_address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Processed */}
      {processed.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4">Processed Requests</h2>
          <div className="space-y-3">
            {processed.map((r) => (
              <div key={r.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.status === "approved" ? "bg-ig-green-light" : "bg-ig-red-light"}`}>
                    {r.status === "approved" ? <BadgeCheck className="h-4 w-4 text-ig-green" /> : <XCircle className="h-4 w-4 text-ig-red" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{r.store_name}</p>
                    <p className="text-xs text-muted-foreground">{r.owner_name}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  r.status === "approved" ? "bg-ig-green-light text-ig-green" : "bg-ig-red-light text-ig-red"
                }`}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
