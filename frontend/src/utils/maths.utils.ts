export const parseAmount = (value: string): number => {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return Number.NaN;

  return Number(digits);
};

export const calculateProgress = (goal: string, raised: string): number => {
  const goalAmount = parseAmount(goal);
  const raisedAmount = parseAmount(raised);
  const progressRaw
    = Number.isFinite(goalAmount)
      && goalAmount > 0
      && Number.isFinite(raisedAmount)
      ? (raisedAmount / goalAmount) * 100
      : 0;

  return Math.max(0, Math.min(100, Math.round(progressRaw)));
};
