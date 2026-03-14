export type RouteTone =
  | "home"
  | "forum"
  | "halls"
  | "bazaar"
  | "events"
  | "member"
  | "entry"
  | "danger";

export interface RouteBadgeSpec {
  id: string;
  href: string;
  label: string;
  shortLabel: string;
  section?: string | null;
  tone: RouteTone;
  a11yLabel: string;
  description?: string;
}

const glyphMap: Record<RouteTone, string> = {
  home: "M12 4 4.5 9.7V20h15V9.7L12 4Zm0 2.3 5.5 4.2V18H6.5v-7.5L12 6.3Zm-2 4.2h4v2h2v2h-2v2h-4v-2H8v-2h2v-2Z",
  forum: "M7 5.5h8.5l3 3V18a2 2 0 0 1-2 2h-9A2.5 2.5 0 0 1 5 17.5v-9A3 3 0 0 1 8 5h7v2H8a1 1 0 0 0-1 1v9.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7H14a2 2 0 0 1-2-2V5.5Zm7 1.8V8.5h1.2L14 7.3Zm-5 4.2h6v1.5H9v-1.5Zm0 3h6v1.5H9v-1.5Z",
  halls: "M5 19V9.5L12 4l7 5.5V19h-2v-8h-2v8h-2v-8h-2v8H9v-8H7v8H5Zm3-9h8l-4-3-4 3Z",
  bazaar: "M7 7h10l1.2 3.5A2.5 2.5 0 0 1 16 14H8a2.5 2.5 0 0 1-2.2-3.5L7 7Zm1.4 2-1 2.7c-.1.4.2.8.6.8h8c.4 0 .7-.4.6-.8l-1-2.7H8.4ZM9.5 15.5a2.5 2.5 0 0 0 0 5c1 0 1.8-.5 2.2-1.3.4.8 1.2 1.3 2.3 1.3a2.5 2.5 0 1 0 0-5c-1 0-1.9.5-2.3 1.3-.4-.8-1.2-1.3-2.2-1.3Z",
  events: "M7 4h10v2h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2V4Zm0 4H6v10h12V8h-1v2H7V8Zm2-2v2h6V6H9Zm2 6h2v2h2v2h-2v2h-2v-2H9v-2h2v-2Z",
  member: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4 0 7 2.3 7 5v1H5v-1c0-2.7 3-5 7-5Zm0 1.8c-3 0-5 1.5-5 3.2h10c0-1.7-2-3.2-5-3.2Z",
  entry: "M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v-2H6V6h5V4Zm3.3 4.3-1.4 1.4 1.3 1.3H9v2h5.2l-1.3 1.3 1.4 1.4L18 12l-3.7-3.7Z",
  danger: "M12 4 4 8v4c0 4.3 2.7 6.8 8 8 5.3-1.2 8-3.7 8-8V8l-8-4Zm3.5 9.1-1.4 1.4L12 12.4l-2.1 2.1-1.4-1.4L10.6 11 8.5 8.9l1.4-1.4L12 9.6l2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z",
};

export function getRouteGlyph(tone: RouteTone) {
  return glyphMap[tone];
}

export const primaryRoutes: RouteBadgeSpec[] = [
  { id: "home", href: "/", label: "Guild Home", shortLabel: "Home", tone: "home", section: "Guild Routes", a11yLabel: "Go to guild home", description: "Return to the great hall and featured notices." },
  { id: "threads", href: "/threads", label: "Forum Records", shortLabel: "Forum", tone: "forum", section: null, a11yLabel: "Browse forum records", description: "Read lessons, showcases, and guild debates." },
  { id: "categories", href: "/categories", label: "Craft Halls", shortLabel: "Halls", tone: "halls", section: "Forum Halls", a11yLabel: "Browse craft halls", description: "Enter the right chamber for each craft." },
  { id: "marketplace", href: "/marketplace", label: "Guild Bazaar", shortLabel: "Bazaar", tone: "bazaar", section: "Guild Trade", a11yLabel: "Browse the guild bazaar", description: "Inspect fresh wares and trusted sellers." },
  { id: "events", href: "/events", label: "Gatherings", shortLabel: "Events", tone: "events", section: null, a11yLabel: "Browse guild gatherings", description: "Track workshops, musters, and challenges." },
];

export const memberRoutes = {
  profile: { id: "profile", href: "/profile", label: "Member Ledger", shortLabel: "Profile", tone: "member" as const, a11yLabel: "Open your member profile" },
  enter: { id: "auth", href: "/auth", label: "Enter Guild", shortLabel: "Enter", tone: "entry" as const, a11yLabel: "Open guild sign in and registration" },
  leave: { id: "logout", href: "#", label: "Leave Guild", shortLabel: "Leave", tone: "danger" as const, a11yLabel: "Log out from the guild" },
};
