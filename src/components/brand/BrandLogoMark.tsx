import { cn } from "@/lib/utils";

type BrandLogoMarkProps = {
  className?: string;
};

/**
 * Vertical vitrified V reserved for the Velocentum logo lockup.
 * It is intentionally different from CrystalV, the wider narrative object.
 */
export function BrandLogoMark({ className }: BrandLogoMarkProps) {
  return (
    <img
      src="/brand-approved/official/identity/isotipo-approved.svg"
      alt=""
      aria-hidden="true"
      className={cn("brand-logo-mark", className)}
    />
  );
}
