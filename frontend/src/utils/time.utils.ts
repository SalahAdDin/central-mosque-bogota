export function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export const getCurrentMinutes = (timeZone: string): number => {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(now);
    const getPart = (type: string) => Number(parts.find(part => part.type === type)?.value);

    const h = getPart("hour");
    const m = getPart("minute");

    if (isNaN(h) || isNaN(m)) throw new Error("Invalid time parts");
    return h * 60 + m;
  }
  catch (error) {
    console.warn(`Timezone "${timeZone}" failed, falling back to local time.\n${error instanceof Error ? error.message : String(error)}`);
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
};

export const isTimeInRange = (
  now: number,
  start: number,
  end: number
): boolean => {
  if (start < end) {
    return now >= start && now < end;
  }
  return now >= start || now < end;
};

export const formatTime = (value: unknown): string => {
  if (typeof value !== "string") return "—";
  const trimmed = value.trim();
  return trimmed ? trimmed : "—";
};
