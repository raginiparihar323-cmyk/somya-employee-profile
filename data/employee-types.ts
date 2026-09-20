export interface SocialLink {
  id: string;
  platform: string;
  label?: string;
  url: string;
  display_order: number;
}

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  slug: string;
  photo_url: string;
  designation: string;
  department: string;
  location?: string;
  joined_date?: string;
  bio: string;
  email?: string;
  phone?: string;
  show_email: boolean;
  show_phone: boolean;
  status: "active" | "inactive";
  social_links: SocialLink[];
  created_at: string;
  updated_at: string;
}

export type EmployeeFormData = Omit<
  Employee,
  "id" | "created_at" | "updated_at" | "social_links"
> & {
  social_links: Omit<SocialLink, "id">[];
};

export const PLATFORM_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  linkedin: {
    label: "LinkedIn",
    icon: "Linkedin",
    color: "#0A66C2",
  },

  github: {
    label: "GitHub",
    icon: "Github",
    color: "#333333",
  },

  instagram: {
    label: "Instagram",
    icon: "Instagram",
    color: "#E4405F",
  },

  twitter: {
    label: "X / Twitter",
    icon: "Twitter",
    color: "#1DA1F2",
  },

  portfolio: {
    label: "Portfolio",
    icon: "Globe",
    color: "#8B5CF6",
  },

  website: {
    label: "Website",
    icon: "ExternalLink",
    color: "#06B6D4",
  },

  youtube: {
    label: "YouTube",
    icon: "Youtube",
    color: "#FF0000",
  },

  dribbble: {
    label: "Dribbble",
    icon: "Dribbble",
    color: "#EA4C89",
  },

  behance: {
    label: "Behance",
    icon: "Palette",
    color: "#1769FF",
  },

  custom: {
    label: "Custom Link",
    icon: "Link",
    color: "#6B7280",
  },
};