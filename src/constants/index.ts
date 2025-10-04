// Order status constants
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PICKUP_SCHEDULED: 'PICKUP_SCHEDULED',
    PICKED_UP: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    FAILED_DELIVERY: 'FAILED_DELIVERY',
} as const;

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Chờ xử lý',
    [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
    [ORDER_STATUS.PICKUP_SCHEDULED]: 'Đã lên lịch lấy hàng',
    [ORDER_STATUS.PICKED_UP]: 'Đã lấy hàng',
    [ORDER_STATUS.IN_TRANSIT]: 'Đang vận chuyển',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Đang giao hàng',
    [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy',
    [ORDER_STATUS.FAILED_DELIVERY]: 'Giao hàng thất bại',
} as const;

export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUS.PICKUP_SCHEDULED]: 'bg-purple-100 text-purple-800',
    [ORDER_STATUS.PICKED_UP]: 'bg-indigo-100 text-indigo-800',
    [ORDER_STATUS.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-green-100 text-green-800',
    [ORDER_STATUS.DELIVERED]: 'bg-emerald-100 text-emerald-800',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
    [ORDER_STATUS.FAILED_DELIVERY]: 'bg-red-100 text-red-800',
} as const;

// User roles
export const USER_ROLES = {
    CUSTOMER: 'customer',
    CARRIER: 'carrier',
    ADMIN: 'admin',
} as const;

// Navigation paths
export const PATHS = {
    HOME: '/',

    // Customer paths
    CUSTOMER: {
        ORDERS: '/orders',
        CREATE_ORDER: '/orders/create',
        QUOTE: '/quote',
        TRACKING: '/tracking',
        RATINGS: '/ratings',
        PROFILE: '/profile',
    },

    // Auth paths
    AUTH: {
        SIGNIN: '/auth/signin',
        SIGNUP: '/auth/signup',
    },

    // Carrier paths
    CARRIER: {
        DASHBOARD: '/carrier/dashboard',
        ORDERS: '/carrier/orders',
        FLEET: '/carrier/fleet',
        SCHEDULE: '/carrier/schedule',
        REPORTS: '/carrier/reports',
        PROFILE: '/carrier/profile',
        SIGNIN: '/carrier/signin',
        SIGNUP: '/carrier/signup',
    },
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+84|0)[3|5|7|8|9][0-9]{8}$/,
    BUSINESS_LICENSE: /^[0-9]{10,13}$/,
} as const;

// Common form field labels
export const FORM_LABELS = {
    EMAIL: 'Email',
    PASSWORD: 'Mật khẩu',
    CONFIRM_PASSWORD: 'Xác nhận mật khẩu',
    FULL_NAME: 'Họ và tên',
    PHONE: 'Số điện thoại',
    COMPANY_NAME: 'Tên công ty',
    BUSINESS_LICENSE: 'Giấy phép kinh doanh',
    ADDRESS: 'Địa chỉ',
    REMEMBER_ME: 'Ghi nhớ đăng nhập',
} as const;

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        SIGNIN: '/api/auth/signin',
        SIGNUP: '/api/auth/signup',
        LOGOUT: '/api/auth/logout',
        PROFILE: '/api/auth/profile',
    },
    ORDERS: {
        LIST: '/api/orders',
        CREATE: '/api/orders',
        UPDATE: '/api/orders',
        DELETE: '/api/orders',
    },
    CARRIERS: {
        LIST: '/api/carriers',
        PROFILE: '/api/carriers/profile',
        FLEET: '/api/carriers/fleet',
        REPORTS: '/api/carriers/reports',
    },
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];