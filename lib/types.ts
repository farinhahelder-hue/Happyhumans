export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  tags: string[] | null;
  note_angle: string | null;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HistoryEntry {
  id: string;
  content_type: string;
  content_id: string;
  action: "create" | "update" | "delete" | "restore";
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  created_at: string;
}
