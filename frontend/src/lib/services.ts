import { apiClient } from './api';
import {
    User,
    SignUpData,
    SignInData,
    AuthResponse,
    Order,
    CreateOrderForm,
    QuoteRequest,
    QuoteOption,
    CarrierSuggestion,
    ServiceRating,
    DashboardStats,
    ProfileUpdateForm
} from '@/types';

// Authentication Services
export const authService = {
    signUp: async (data: SignUpData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    signIn: async (data: SignInData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signin', data);
        if (response.success) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    signOut: async (): Promise<void> => {
        await apiClient.post('/auth/signout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    updateProfile: async (data: ProfileUpdateForm): Promise<User> => {
        const response = await apiClient.put<User>('/auth/profile', data);
        return response.data;
    }
};

// Order Services
export const orderService = {
    createOrder: async (data: CreateOrderForm): Promise<Order> => {
        const response = await apiClient.post<Order>('/orders', data);
        return response.data;
    },

    getOrders: async (page = 1, limit = 10, status?: string) => {
        const params = { page, limit, ...(status && { status }) };
        return await apiClient.getPaginated<Order>('/orders', params);
    },

    getOrder: async (id: string): Promise<Order> => {
        const response = await apiClient.get<Order>(`/orders/${id}`);
        return response.data;
    },

    trackOrder: async (orderNumber: string): Promise<Order> => {
        const response = await apiClient.get<Order>(`/orders/track/${orderNumber}`);
        return response.data;
    },

    cancelOrder: async (id: string): Promise<Order> => {
        const response = await apiClient.put<Order>(`/orders/${id}/cancel`);
        return response.data;
    },

    downloadInvoice: async (orderId: string, format: 'pdf' | 'csv'): Promise<Blob> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice?format=${format}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );
        return response.blob();
    }
};

// Quote Services
export const quoteService = {
    getQuote: async (data: QuoteRequest): Promise<QuoteOption[]> => {
        const response = await apiClient.post<QuoteOption[]>('/quotes', data);
        return response.data;
    },

    getCarrierSuggestions: async (data: QuoteRequest): Promise<CarrierSuggestion[]> => {
        const response = await apiClient.post<CarrierSuggestion[]>('/quotes/suggestions', data);
        return response.data;
    }
};

// Rating Services
export const ratingService = {
    submitRating: async (data: Omit<ServiceRating, 'id' | 'createdAt'>): Promise<ServiceRating> => {
        const response = await apiClient.post<ServiceRating>('/ratings', data);
        return response.data;
    },

    getOrderRating: async (orderId: string): Promise<ServiceRating | null> => {
        try {
            const response = await apiClient.get<ServiceRating>(`/ratings/order/${orderId}`);
            return response.data;
        } catch {
            return null;
        }
    }
};

// Dashboard Services
export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get<DashboardStats>('/dashboard/stats');
        return response.data;
    }
};

// Location Services
export const locationService = {
    getProvinces: async () => {
        const response = await apiClient.get('/locations/provinces');
        return response.data;
    },

    getDistricts: async (provinceCode: string) => {
        const response = await apiClient.get(`/locations/provinces/${provinceCode}/districts`);
        return response.data;
    },

    getWards: async (provinceCode: string, districtCode: string) => {
        const response = await apiClient.get(`/locations/provinces/${provinceCode}/districts/${districtCode}/wards`);
        return response.data;
    }
};