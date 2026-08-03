export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  member_count: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  organization_name: string;
  organization_detail: Organization | null;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  start_date: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  description: string;
  organization: string;
  created_at: string;
  updated_at: string;
  entry_count: number;
  delivery_count: number;
  issue_count: number;
}

export interface WorkItem {
  id?: string;
  description: string;
  quantity: string | null;
  unit: string;
}

export interface Delivery {
  id?: string;
  material: string;
  quantity: string | null;
  supplier: string;
  condition: 'Good' | 'Damaged' | 'Partial' | 'Rejected';
}

export interface Plan {
  id?: string;
  activity: string;
  expected_date: string | null;
}

export interface Issue {
  id?: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SiteEntry {
  id: string;
  project: string;
  project_name: string;
  user: string;
  user_name: string;
  organization: string;
  date: string;
  weather: string;
  personnel: number;
  work_items: WorkItem[];
  deliveries: Delivery[];
  plans: Plan[];
  issues: Issue[];
  created_at: string;
  updated_at: string;
}

export interface SiteEntryCreate {
  project: string;
  date: string;
  weather: string;
  personnel: number;
  work_items_data?: WorkItem[];
  deliveries_data?: Delivery[];
  plans_data?: Plan[];
  issues_data?: Issue[];
}

export interface ReportSummary {
  type: string;
  project_name: string;
  period: {
    label: string;
    from: string;
    to: string;
  };
  total_entries: number;
  total_deliveries: number;
  total_personnel: number;
  total_issues: number;
  issues: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  work_completion: number;
}
