import Link from "next/link";
import { Icon } from "./Icon";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Remotyx home">
      <span className="logo-mark">
        <Icon name="right" size={14} stroke={3} color="#0B0D12" />
      </span>
      remotyx
    </Link>
  );
}
