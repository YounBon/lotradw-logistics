import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateOrderNumber(): string {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

export function calculateShippingCost(
    weight: number,
    distance: number,
    basePrice: number,
    pricePerKm: number
): number {
    const baseCost = basePrice;
    const distanceCost = distance * pricePerKm;
    const weightMultiplier = weight > 1 ? 1 + (weight - 1) * 0.1 : 1;

    return Math.round((baseCost + distanceCost) * weightMultiplier);
}

export function getOrderStatusColor(status: string): string {
    const colors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        CONFIRMED: 'bg-blue-100 text-blue-800',
        PICKUP_SCHEDULED: 'bg-purple-100 text-purple-800',
        PICKED_UP: 'bg-indigo-100 text-indigo-800',
        IN_TRANSIT: 'bg-orange-100 text-orange-800',
        OUT_FOR_DELIVERY: 'bg-green-100 text-green-800',
        DELIVERED: 'bg-emerald-100 text-emerald-800',
        CANCELLED: 'bg-red-100 text-red-800',
        FAILED_DELIVERY: 'bg-red-100 text-red-800',
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getOrderStatusText(status: string): string {
    const texts = {
        PENDING: 'Chờ xử lý',
        CONFIRMED: 'Đã xác nhận',
        PICKUP_SCHEDULED: 'Đã lên lịch lấy hàng',
        PICKED_UP: 'Đã lấy hàng',
        IN_TRANSIT: 'Đang vận chuyển',
        OUT_FOR_DELIVERY: 'Đang giao hàng',
        DELIVERED: 'Đã giao hàng',
        CANCELLED: 'Đã hủy',
        FAILED_DELIVERY: 'Giao hàng thất bại',
    };

    return texts[status as keyof typeof texts] || status;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}