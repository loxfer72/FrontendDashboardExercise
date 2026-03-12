export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return "€—";
  return `€${amount.toLocaleString("fr-FR")}`;
};

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });

export const getCostTrend = (current: number, previous: number): string => {
  if (!previous) return "—";
  const diff = ((current - previous) / previous) * 100;
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
};