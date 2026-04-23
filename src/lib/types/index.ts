export interface User {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin';
  roles?: string[];
  age?: number;
  profile?: {
    age?: number;
    income?: number;
    state?: string;
    category?: string;
  };
}

export interface Scheme {
  _id?: string;
  name: string;
  nameHi: string;
  nameMr: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  eligibleCategories: string[];
  benefitAmount: number;
  applicationDeadline: string;
  website: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export type Language = "en" | "hi" | "mr";
