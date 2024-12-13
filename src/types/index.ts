export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  services: Service[];
  contact: ContactInfo;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface JobRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  category: string;
  location: string;
  created_at: string;
  bids?: Array<{
    id: string;
    amount: number;
    proposal: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    business: {
      id: string;
      business_name: string;
      user_id: string;
    };
  }>;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}