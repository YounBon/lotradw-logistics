import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from 'date-fns';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, VALIDATION_PATTERNS } from '@/constants';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
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
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
}

export function getOrderStatusText(status: string): string {
    return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
}

export function validateEmail(email: string): boolean {
    return VALIDATION_PATTERNS.EMAIL.test(email);
}

export function validatePhone(phone: string): boolean {
    return VALIDATION_PATTERNS.PHONE.test(phone);
}

export function validateBusinessLicense(license: string): boolean {
    return VALIDATION_PATTERNS.BUSINESS_LICENSE.test(license);
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