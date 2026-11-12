import type { ContactLink } from "@/types/content";

/** Confirmed links from the CV. The phone number is intentionally omitted. */
export const contactLinks: ContactLink[] = [
  { id: "github", label: "GitHub", display: "github.com/emilywingler", href: "https://github.com/emilywingler" },
  { id: "linkedin", label: "LinkedIn", display: "linkedin.com/in/emily-wingler", href: "https://www.linkedin.com/in/emily-wingler/" },
  { id: "email", label: "Email", display: "wingleremily@gmail.com", href: "mailto:wingleremily@gmail.com" },
];
