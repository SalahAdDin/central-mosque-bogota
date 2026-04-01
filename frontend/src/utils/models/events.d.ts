export type TEvent = {
  /**
   * Short label displayed above the title (e.g. "Educación", "Conferencia", "Clase").
   */
  category: string;
  /**
   * Main card heading.
   */
  title: string;
  /**
   * Supporting summary text shown under the title.
   */
  description: string;
  /**
   * Human-readable schedule string (e.g. "Sáb 15 Oct · 10:00" or "Every Friday · 18:00").
   */
  schedule: string;
  /**
   * Physical location where the event takes place.
   */
  location: string;
  /**
   * URL to the event's full details page.
   */
  url: string;
  /**
   * URL to the event's image or thumbnail.
   */
  image: string;
  /**
   * Date of the event in `{ month: string; day: number; }` format.
   * month: Short month name (e.g. "Oct")
   * day: Day of the month (e.g. 15)
   */
  date: {
    month: string;
    day: number;
  };
};
