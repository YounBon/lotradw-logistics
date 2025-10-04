import { useState } from 'react';

export interface ValidationRule {
    required?: boolean;
    email?: boolean;
    phone?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
}

export interface ValidationRules {
    [key: string]: ValidationRule;
}

export interface FormErrors {
    [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
    initialState: T,
    validationRules: ValidationRules
) {
    const [formData, setFormData] = useState<T>(initialState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateField = (name: string, value: string): string => {
        const rule = validationRules[name];
        if (!rule) return '';

        if (rule.required && !value.trim()) {
            return `${name} là bắt buộc`;
        }

        if (rule.email && value && !/\S+@\S+\.\S+/.test(value)) {
            return 'Email không hợp lệ';
        }

        if (rule.phone && value && !/^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(value)) {
            return 'Số điện thoại không hợp lệ';
        }

        if (rule.minLength && value.length < rule.minLength) {
            return `Tối thiểu ${rule.minLength} ký tự`;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return `Tối đa ${rule.maxLength} ký tự`;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            return 'Định dạng không hợp lệ';
        }

        if (rule.custom) {
            const customError = rule.custom(value);
            if (customError) return customError;
        }

        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const value = formData[fieldName] || '';
            const error = validateField(fieldName, value);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
        setIsLoading(false);
    };

    return {
        formData,
        errors,
        isLoading,
        setFormData,
        setErrors,
        setIsLoading,
        handleChange,
        validateForm,
        validateField,
        resetForm
    };
}