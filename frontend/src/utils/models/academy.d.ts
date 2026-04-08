type TAcademyArticle = {
  /**
   * Title of the article
   */
  title: string;
  /**
   * Description of the article
   */
  description: string;
  /**
   * URL of the image to be displayed
   */
  imageUrl: string;
  /**
   * Alt text for the image
   */
  imageAlt: string;
  /**
   * Label for the badge
   */
  badgeLabel: string;
  /**
   * Tone of the badge
   */
  badgeTone?: "primary" | "secondary";
  /**
   * URL to be linked when clicking on the card
   */
  href: string;
  /**
   * Label shown on the CTA button
   */
  ctaLabel: string;
  /**
   * Icon to be displayed on the CTA button
   */
  ctaIcon: string;
};
