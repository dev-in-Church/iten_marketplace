import { Check } from "lucide-react";

export function VendorRow({
  name,
  verified,
}: {
  name: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-muted-foreground truncate">{name}</span>
      {verified && (
        <Check className="h-3.5 w-3.5 bg-ig-green text-white rounded-full shrink-0" />
      )}
    </div>
  );
}
