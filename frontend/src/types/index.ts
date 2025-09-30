// User and Authentication Types
export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Order Types
export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    value: number;
    category: string;
}

export interface Address {
    name: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    postalCode?: string;
}

export interface Order {
    id: string;
    customerId: string;
    orderNumber: string;
    status: OrderStatus;
    senderInfo: Address;
    receiverInfo: Address;
    items: OrderItem[];
    totalWeight: number;
    totalValue: number;
    deliveryDeadline: string;
    pickupDate?: string;
    deliveryDate?: string;
    carrierId?: string;
    carrierName?: string;
    trackingNumber?: string;
    shippingCost: number;
    eta: string;
    timeline: OrderTimeline[];
    rating?: ServiceRating;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PICKUP_SCHEDULED'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'FAILED_DELIVERY';

export interface OrderTimeline {
    id: string;
    orderId: string;
    status: OrderStatus;
    message: string;
    location?: string;
    timestamp: string;
    isCompleted: boolean;
}

// Carrier Types
export interface Carrier {
    id: string;
    name: string;
    logo?: string;
    description: string;
    serviceAreas: string[];
    vehicleTypes: VehicleType[];
    rating: number;
    totalOrders: number;
    onTimePercentage: number;
    pricePerKm: number;
    basePrice: number;
    isActive: boolean;
    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };
}

export type VehicleType =
    | 'MOTORCYCLE'
    | 'CAR'
    | 'VAN'
    | 'TRUCK_SMALL'
    | 'TRUCK_MEDIUM'
    | 'TRUCK_LARGE';

export interface CarrierSuggestion {
    carrier: Carrier;
    estimatedPrice: number;
    estimatedDuration: number; // in hours
    eta: string;
    matchScore: number; // 0-100
    pros: string[];
    cons: string[];
}

// Quote Types
export interface QuoteRequest {
    origin: {
        province: string;
        district: string;
        ward: string;
    };
    destination: {
        province: string;
        district: string;
        ward: string;
    };
    weight: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    deliveryType: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
    value?: number;
}

export interface QuoteOption {
    carrierId: string;
    carrierName: string;
    price: number;
    duration: number; // in hours
    eta: string;
    serviceType: string;
    features: string[];
}

// Rating Types
export interface ServiceRating {
    id: string;
    orderId: string;
    customerId: string;
    carrierId: string;
    rating: number; // 1-5
    feedback: string;
    categories: {
        punctuality: number;
        communication: number;
        packaging: number;
        overall: number;
    };
    createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    message?: string;
}

// Form Types
export interface CreateOrderForm {
    senderInfo: Address;
    receiverInfo: Address;
    items: Omit<OrderItem, 'id'>[];
    deliveryDeadline: string;
    notes?: string;
}export interface ProfileUpdateForm {
    name: string;
    phone: string;
    address: string;
}

// Dashboard Types
export interface DashboardStats {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
    averageRating: number;
    recentOrders: Order[];
}

// Location Types
export interface Province {
    code: string;
    name: string;
    districts: District[];
}

export interface District {
    code: string;
    name: string;
    wards: Ward[];
}

export interface Ward {
    code: string;
    name: string;
}