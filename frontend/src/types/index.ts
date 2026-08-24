export const freelancerLevels = ['junior', 'middle', 'senior'] as const;
export type FreelancerLevel = (typeof freelancerLevels)[number];

export const orderStatuses = ['new', 'confirmed', 'success', 'canceled'] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export interface UserInfo {
    id: string;
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    id: string;
    name: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface SignUpRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Freelancer {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatar: string | null;
    level: FreelancerLevel;
    education: string;
    location: string;
    skills: string;
    info: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FreelancerFormData {
    name: string;
    lastName: string;
    email: string;
    level: FreelancerLevel;
    education: string;
    location: string;
    skills: string;
    info: string;
    avatarBase64?: string;
}

export interface OrderOwner {
    id: string;
    name: string;
    lastName: string;
}

export interface OrderFreelancer {
    id: string;
    name: string;
    lastName: string;
    avatar: string | null;
    level: FreelancerLevel;
}

export interface Order {
    id: string;
    number: number;
    description: string;
    deadlineDate: string;
    scheduledDate: string;
    completeDate: string | null;
    owner: OrderOwner;
    freelancer: OrderFreelancer;
    amount: number;
    status: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderFormData {
    description: string;
    amount: number;
    status: OrderStatus;
    freelancer: string;
    scheduledDate: string;
    deadlineDate: string;
    completeDate?: string | null;
}

export interface ApiMessageResponse {
    error: boolean;
    message: string;
    id?: string;
}

export interface ApiErrorResponse {
    error: true;
    message: string;
}
