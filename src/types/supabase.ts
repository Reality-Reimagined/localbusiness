export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'user' | 'business';
          phone: string | null;
          location: string | null;
          bio: string | null;
          profile_image_url: string | null;
          interests: string[] | null;
          created_at: string;
          updated_at: string;
          profile_complete: boolean;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'user' | 'business';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          interests?: string[] | null;
          profile_complete?: boolean;
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'user' | 'business';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          interests?: string[] | null;
          profile_complete?: boolean;
        };
      };
      // Add other table definitions as needed
    };
  };
}