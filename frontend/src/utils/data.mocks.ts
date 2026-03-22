import type { TEvent } from "./models/events";
import type { TCommunityService } from "./models/services";

export const lemma
  = "La primera y principal mezquita de Bogotá, brindando servicios espirituales y sociales a la comunidad desde hace más de 30 años.";

export const contactInfo = {
  address: "Calle 80 #30-45, Bogotá D.C., Colombia",
  phone: "+57 (601) 123 4567",
  email: "info@mezquitabogota.org",
};

export const fastLinks = [
  { label: "Horarios de Rezo", href: "/schedules" },
  { label: "Donaciones Online", href: "/donations" },
  { label: "Programas Educativos", href: "/educational-programs" },
  { label: "Zakat al-Fitr", href: "/zakat-al-fitr" },
  { label: "Voluntariado", href: "/volunteer" },
];

export const socialNetworkLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/mezquitabogota",
    icon: "facebook" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mezquitabogota",
    icon: "instagram" as const,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/mezquitabogota",
    icon: "youtube" as const,
  },
];

export const rightsText = {
  copyRight:
    "© 2024 Mezquita Central de Bogotá. Todos los derechos reservados.",
  privacyPolicy: { label: "Política de Privacidad", href: "/privacy-policy" },
  termsAndConditions: {
    label: "Términos y Condiciones",
    href: "/terms-and-conditions",
  },
};

export const navLinks = [
  { label: "Nosotros", href: "/about-us" },
  { label: "Islam", href: "/islam-and-faith" },
  { label: "Prayer", href: "/prayer-information" },
  { label: "Events", href: "/events-and-programs" },
  { label: "Comminity", href: "/community-services" },
  { label: "Contact", href: "/contact-and-visit" },
];

export const events: Array<TEvent> = [
  {
    category: "Educación",
    title: "Clase de Árabe Clásico",
    description:
      "Aprende los fundamentos del idioma árabe y la gramática del Corán con instructores certificados.",
    schedule: "18:00 - 20:00",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2BT6Jztlh7ad7MeluINOUNUGLjyMu2cEqolZDsyGhQzx1Y7Qy_DH6J2x7sv0GGqxPYbTrWOFyAov6rSkKrZZKH56b_59Sd9zXRHXyTX-LaaCFZAi3nL2bPb0jDCRp0yAu49PriAhAeafH68l9gwX2RpauMK3gETpCE_DPrVmSxJDWUIe81d1Nlbw82je21kBjFqSP_aPzQwYGVZdvPggzO8vfMdwGADXHfRC98B7VPurzaR1xCwMoGB2e--BHc1BTpVyrU7j932XI",
    date: { month: "Oct", day: 15 },
  },
  {
    category: "Comunidad",
    title: "Cena Comunitaria",
    description:
      "Un espacio para compartir alimentos y fortalecer los lazos entre las familias de la comunidad.",
    schedule: "19:30 - 21:30",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB46G_zagethWTQbcfv_b0nnGkofgD0uv8Vy3RDuzUE7ThDDCN6MnwLwYTRjVhRPVmK682qGREveowLbtN3NiAxYL6Df7YhJLJ8eqcOueLp6Tw6R6_9qVnKyVC220IR8rWPbK2tepMhlChwpowpubNFcbktMTPUZCP3baqXkz46WNYKkySntbhAXsMqPux48R10WbKOwy-ghJppPZGXKBOZW_DjOkEVnq02GshAR20e7TdT_0nqGTAhR5xi3uIMwvX73wsEcx5gFIt",
    date: { month: "Oct", day: 18 },
  },
  {
    category: "Jóvenes",
    title: "Círculo de Jóvenes",
    description:
      "Diálogo abierto sobre desafíos contemporáneos y el papel de la juventud en la fe.",
    schedule: "17:00 - 19:00",
    location: "Mezquita Central de Bogotá",
    url: "#",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDW42btUFIp07IZZb16JXmVfA_4CMxaoGAfolrWyVo8rRsmqRIqM0vtKIdradMVnr3Qr7F4D1Vtwjl3kbxrUjwwnJfuFvNO21F1_S8p9-bcAOonShZsIR9-EYqaW6bnQkkbzij0wgNREbDiN_HNU9oykbaGS8psymOJ_g1ouNcpCw4_oqGQu9heyCo5tfBLlt4tOQOkZJ02GZkT6Yd-f0Foyvf80e9_HLgYO1WwpX_doLKuiaEVnR3qfdVU2KpAPzy5fIhicG8Hwv8R",
    date: { month: "Oct", day: 20 },
  },
];

export const defaultServices: Array<TCommunityService> = [
  {
    icon: "menu_book",
    title: "Escuela Coránica",
    description:
      "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
  },
  {
    icon: "volunteer_activism",
    title: "Apoyo Social",
    description:
      "Programas de distribución de alimentos y asistencia a familias necesitadas de la ciudad.",
  },
  {
    icon: "church",
    title: "Bodas & Nikah",
    description:
      "Oficiamos ceremonias matrimoniales islámicas y asesoramiento para parejas.",
  },
  {
    icon: "groups",
    title: "Juventud",
    description:
      "Espacio dedicado a actividades recreativas y educativas para jóvenes musulmanes.",
  },
];

export const mediaHighlights = [
  {
    title: "La importancia de leer el Sagrado Corán",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3E7lrQkQB_RaV6iMPDiVK7Ec0b8eW78Mh2I5o4BsWJCrzbT6f6hnB1XnvXU4TVwbUqdt43guoQ-_vgvKiKdn3av2dMJ7Ef3LMWVIBHT4A2QngXs40zKXoHjNgf-4xo8aCk4vZP8P8biIAxgVGOOffolXed8kcxom7JVmDrY0Tj2hJhcwRrXna8-V4MiwE_Xidcu9rVfr6yVGB-BvC-VBETgnnTlcbEYInVl0QnW8u8oCHxPNdIiXBWnx-Epf-T7TqVdRP6HUcutM",
    imageAlt: "Podcast 1",
  },
  {
    title: "El Valor de las 5 Oraciones Diarias",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_pOrlKWaBb21MxbHQoGm8DVBDNLoy0YFSQM6fak9nafsSKqy9AoGdRaiKkvWZ2CWQ9AC9eCFUTTv7BnNuxDRdnszV_KXS1QLDDmEtj62BEAIiJSxxz2svEJyCzDf3Xxn0Vyz_9qWSly4ws4PgmP6P1RSxI89Q2JT99wGy-dniYTJ0nmaIccbIjoseFmHBPs8oUC1mgnBDuDChFsxIv49cBiwt_XDMasu9xx6vWQIlhr9yYtcKm5ghsQ26IongjRMKfVM-jb2y9w",
    imageAlt: "Podcast 2",
  },
  {
    title: "La Virtud de Buscar el Conocimiento",
    href: "#",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3yTR3f77aCob-ydTr3OKP4s8E0dMaVK3cuIke3la64bFhGAlLd2oe1y7UOtvPDRPE3trAOcnapjXdGggsJN_PWqcMhLg-PMZIZG7nFc_sVDGHhLgYf-F0mj3CuFFasrZGGUQNw-6mQ9p9_nRxrtxAGdg1LLI7fD-aAsmlowlSEac54fgD0GZiCn3p6oxo2ukpFtcFNsTdlLpYZGxDd8DgYgDZqdsmsiP2FpM1NwcUFSPakOA7sXxbx999bOCvSu0bC0k9zQYEJ6Y",
    imageAlt: "Podcast 3",
  },
];

export const academyCourses = [
  {
    badgeLabel: "Fundacional",
    badgeTone: "primary",
    title: "Introducción al Árabe Coránico",
    description:
      "Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.",
    href: "/academy/introduccion-arabe-coranico",
    ctaIcon: "menu_book",
    imageAlt: "Arabic Calligraphy",
    imageUrl:
      "https://stamptitude.com/cdn/shop/files/Arabic-Calligraphy-Stamp.jpg?v=1747036327&width=1080",
  },
  {
    badgeLabel: "Histórico",
    badgeTone: "secondary",
    title: "Historia del Islam",
    description:
      "Un viaje fascinante por los siglos que forjaron una de las civilizaciones más influyentes.",
    href: "/academy/historia-del-islam",
    ctaIcon: "history_edu",
    imageAlt: "Islamic History Manuscript",
    imageUrl:
      "https://c7c8edde.delivery.rocketcdn.me/wp-content/uploads/sonni-ali-1.jpg",
  },
  {
    badgeLabel: "Práctico",
    badgeTone: "primary",
    title: "Fiqh y Ética",
    description:
      "Aplicación de la jurisprudencia islámica y los valores morales en la vida cotidiana moderna.",
    href: "/academy/fiqh-y-etica",
    ctaIcon: "gavel",
    imageAlt: "Fiqh and Ethics",
    imageUrl:
      "https://halalfoundation.org/wp-content/uploads/2025/03/islamic-jurisprudence-980x491.jpg",
  },
];

export const featuredDonation = {
  title: "Remodelación Sala de Oración",
  description:
    "Tu generosidad permite que la Mezquita Central siga siendo un faro de luz en Bogotá. Cada aporte contribuye al mantenimiento de nuestras instalaciones y al crecimiento de nuestros programas sociales.",
  goal: "$100.000.000 COP",
  raised: "$75.000.000 COP",
  ctaHref: "/donate",
  imageAlt: "Inside Mosque",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_gilkVDNWf49Gpn_AO0T3W4CAyawSEg9Fs8QCDx5-0BfVKSk_MGXuRC1NWB3yZORnmbCwPP5CGtUCCqqQLS_ZgvOHXXoU9ZTAs6vTyV8H7Eyxf9HnZluMLXtGsexIiHaBa5Ieq65Gp_XeDzI_P6AMcJX6vP9EzUjICXxOfddgSBvFuceyWt_SiZ_vTxDrBFv5NEy_--M_pcRIa9zRXK6kVZPguMfmAOhoDUzKqajOpOpHt7eyNqwh7pSewKsn5tuIsTaymxA1Gec",
};
