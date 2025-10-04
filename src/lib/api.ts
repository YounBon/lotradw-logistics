import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired, redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/auth/signin';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data);
        return response.data;
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url);
        return response.data;
    }

    async getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
        const response: AxiosResponse<PaginatedResponse<T>> = await this.client.get(url, { params });
        return response.data;
    }
}

export const apiClient = new ApiClient();