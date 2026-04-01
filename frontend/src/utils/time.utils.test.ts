import {
  formatTime,
  getCurrentMinutes,
  isTimeInRange,
  parseTimeToMinutes,
} from "@utils/time.utils";

describe("time.utils", () => {
  describe("parseTimeToMinutes", () => {
    it("should return null when the value is not a string", () => {
      expect(parseTimeToMinutes(null)).toBeNull();
      expect(parseTimeToMinutes(undefined)).toBeNull();
    });

    it("should parse time when the value is a valid HH:MM string", () => {
      expect(parseTimeToMinutes("00:00")).toBe(0);
      expect(parseTimeToMinutes("23:59")).toBe(23 * 60 + 59);
    });

    it("should parse time when the hour has one digit", () => {
      expect(parseTimeToMinutes("7:05")).toBe(7 * 60 + 5);
    });

    it("should trim whitespace when parsing a valid time string", () => {
      expect(parseTimeToMinutes(" 08:30 ")).toBe(8 * 60 + 30);
    });

    it("should return null when the value does not match the HH:MM pattern", () => {
      expect(parseTimeToMinutes("8:5")).toBeNull();
      expect(parseTimeToMinutes("hello")).toBeNull();
      expect(parseTimeToMinutes("")).toBeNull();
    });

    it("should return null when the time is outside the valid range", () => {
      expect(parseTimeToMinutes("24:00")).toBeNull();
      expect(parseTimeToMinutes("12:60")).toBeNull();
      expect(parseTimeToMinutes("-1:00")).toBeNull();
    });
  });

  describe("isTimeInRange", () => {
    it("should include start and exclude end when the range does not wrap midnight", () => {
      expect(isTimeInRange(10, 10, 20)).toBe(true);
      expect(isTimeInRange(19, 10, 20)).toBe(true);
      expect(isTimeInRange(20, 10, 20)).toBe(false);
      expect(isTimeInRange(9, 10, 20)).toBe(false);
    });

    it("should handle ranges that wrap midnight when start is greater than end", () => {
      const start = 22 * 60;
      const end = 2 * 60;

      expect(isTimeInRange(23 * 60, start, end)).toBe(true);
      expect(isTimeInRange(1 * 60, start, end)).toBe(true);
      expect(isTimeInRange(5 * 60, start, end)).toBe(false);
      expect(isTimeInRange(start, start, end)).toBe(true);
      expect(isTimeInRange(end, start, end)).toBe(false);
    });
  });

  describe("formatTime", () => {
    it("should return an em dash when the value is not a string", () => {
      expect(formatTime(null)).toBe("—");
      expect(formatTime(123)).toBe("—");
      expect(formatTime({})).toBe("—");
    });

    it("should return an em dash when the string is empty after trimming", () => {
      expect(formatTime("")).toBe("—");
      expect(formatTime("   ")).toBe("—");
    });

    it("should trim and return the string when it has content", () => {
      expect(formatTime(" 10:00 ")).toBe("10:00");
    });
  });

  describe("getCurrentMinutes", () => {
    it("should return minutes when Intl.DateTimeFormat provides valid time parts", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(function (
          locale?: string | Array<string>,
          options?: Intl.DateTimeFormatOptions
        ) {
          expect(locale).toBe("en-US");
          expect(options?.timeZone).toBe("Africa/Bogota");

          return {
            formatToParts() {
              return [
                { type: "hour", value: "05" },
                { type: "literal", value: ":" },
                { type: "minute", value: "07" },
              ] as Array<Intl.DateTimeFormatPart>;
            },
          } as unknown as Intl.DateTimeFormat;
        });

      expect(getCurrentMinutes("Africa/Bogota")).toBe(5 * 60 + 7);

      dateTimeFormatSpy.mockRestore();
    });

    it("should fall back to local time when Intl.DateTimeFormat fails", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(function () {
          throw new Error("Unsupported timeZone");
        });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        return;
      });
      const getHoursSpy = vi
        .spyOn(Date.prototype, "getHours")
        .mockReturnValue(11);
      const getMinutesSpy = vi
        .spyOn(Date.prototype, "getMinutes")
        .mockReturnValue(22);

      expect(getCurrentMinutes("Invalid/Zone")).toBe(11 * 60 + 22);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Timezone \"Invalid/Zone\" failed, falling back to local time."));

      getMinutesSpy.mockRestore();
      getHoursSpy.mockRestore();
      warnSpy.mockRestore();
      dateTimeFormatSpy.mockRestore();
    });
  });
});
