export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  subscription_status: string;
  charity_id?: string;
  charity_percentage: number;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  date: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  total_contributions: number;
}

export interface Draw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  status: string;
  prize_pool: number;
  winners_count?: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
