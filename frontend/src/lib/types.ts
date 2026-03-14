export interface CategorySummary {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  _count?: {
    threads: number;
  };
}

export interface ThreadSummary {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  categoryId: number;
  author?: {
    username: string;
    avatar?: string | null;
  };
  category?: {
    name: string;
    icon?: string | null;
  };
  posts?: Array<{
    id: number;
    content: string;
    createdAt: string;
    author?: {
      username: string;
      avatar?: string | null;
      signature?: string | null;
      role?: string;
    };
  }>;
  _count?: {
    posts: number;
  };
}

export interface EventSummary {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  _count?: {
    rsvps: number;
  };
}

export interface MarketItemSummary {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string | null;
  seller?: {
    username: string;
    avatar?: string | null;
  };
}

export interface ProfileData {
  id: number;
  username: string;
  email?: string;
  role: string;
  avatar?: string | null;
  signature?: string | null;
  createdAt: string;
  _count?: {
    threads: number;
    posts: number;
    marketItems: number;
  };
  threads?: ThreadSummary[];
  marketItems?: Array<{
    id: number;
    title: string;
    price: number;
  }>;
}
