"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe2 } from "lucide-react";
import api from "@/lib/api";

interface RequestSummary {
  id: string;
  status: string;
  subtotal: string;
  item_count: number;
  created_at: string;
}

export default function InternationalRequestsPage() {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get<{ requests: RequestSummary[] }>("/api/international-requests")
      .then((data) => setRequests(data.requests))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <Link
        href="/international"
        className="mb-8 inline-flex items-center gap-2 text-sm text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to international catalog
      </Link>
      <div className="flex items-center gap-3">
        <Globe2 className="h-7 w-7 text-emerald-700" />
        <div>
          <p className="text-sm uppercase tracking-widest text-emerald-700">
            Sourcing history
          </p>
          <h1 className="text-3xl font-bold">My international requests</h1>
        </div>
      </div>
      {loading ? (
        <p className="py-12 text-muted-foreground">Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            You have not submitted an international request yet.
          </p>
          <Link
            href="/international"
            className="mt-4 inline-block font-medium text-emerald-700"
          >
            Browse international products
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5"
            >
              <div>
                <p className="font-semibold">
                  Request #{request.id.slice(0, 8)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.item_count} items ·{" "}
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  ${Number(request.subtotal).toLocaleString()}
                </p>
                <p className="text-sm capitalize text-emerald-700">
                  {request.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
