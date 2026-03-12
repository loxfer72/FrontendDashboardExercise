export const API_BASE = "https://tt-jsonserver-01.alt-tools.tech";

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-linear-to-r from-emerald-400 to-teal-600 text-white",
  },
  expiring: {
    label: "Expiring",
    className: "bg-linear-to-r from-amber-500 to-orange-600 text-white",
  },
  unused: {
    label: "Unused",
    className: "bg-linear-to-r from-red-500 to-rose-600 text-white",
  },
} as const;

export const NAV_LINKS = [
  { href: "/",          label: "Dashboard" },
  { href: "/tools",     label: "Tools"     },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings",  label: "Settings"  },
] as const;