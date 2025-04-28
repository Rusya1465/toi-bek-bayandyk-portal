
import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  role: 'user' | 'partner' | 'admin';
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}
