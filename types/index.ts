export type UserRole = 'civilian' | 'contractor' | 'worker';

export interface User {
    id: string;
    name: string;
    phone: string;
    role: UserRole;
    boothId?: string;
}

export interface Complaint {
    id: string;
    user_id: string;
    userId?: string;
    category?: string;
    description: string;
    image?: string;
    image_url?: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: 'pending' | 'in-progress' | 'resolved';
    createdAt?: any;
    created_at?: any;
}

export interface Tender {
    id: string;
    title: string;
    description: string;
    deadline: any;
    budget: number;
    status: 'open' | 'closed' | 'awarded';
}

export interface TenderSubmission {
    id: string;
    tenderId: string;
    contractorId: string;
    quote: number;
    documents: string[];
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Booth {
    id: string;
    constituency: string;
    demographics: {
        youth: number;
        farmers: number;
        women: number;
        business_owners: number;
    };
}

export interface Worker {
    id: string;
    name: string;
    boothId: string;
    assignedTasks: string[];
    activityLogs: {
        action: string;
        timestamp: any;
    }[];
}
