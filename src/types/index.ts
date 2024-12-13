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
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed';
  category: string;
  location: string;
  created_at: string;
}