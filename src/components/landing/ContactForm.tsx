"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [sent, setSent] = useState(false);

    const submit = async (e: any) => {
        e.preventDefault();
        // Hiện tại giả lập gửi thành công (sau này gắn API POST /api/lead)
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    if (sent) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md text-center border border-green-100" style={{ fontFamily: 'Inter, "Noto Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
                <div className="text-lg font-semibold text-green-600" style={{ fontWeight: 700 }}>Cảm ơn! Chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.</div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-md border border-orange-50" style={{ fontFamily: 'Inter, "Noto Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <h3 className="text-lg text-gray-800 mb-3" style={{ fontWeight: 700 }}>Nhận tư vấn ngay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tên công ty" className="border px-3 py-2 rounded" />
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Người liên hệ" className="border px-3 py-2 rounded" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="border px-3 py-2 rounded" />
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className="border px-3 py-2 rounded" />
                <select className="border px-3 py-2 rounded" defaultValue="STM">
                    <option value="STM">Sản phẩm quan tâm: STM (Quản lý vận tải)</option>
                    <option value="SWM">SWM (Quản lý kho)</option>
                    <option value="SOM">SOM (Quản lý đơn)</option>
                </select>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tối đa 500 ký tự)" maxLength={500} className="border px-3 py-2 rounded col-span-1 sm:col-span-2" />
            </div>

            <div className="mt-4">
                <Button type="submit" className="bg-orange-600 text-white border-orange-600 hover:bg-orange-700">Gửi yêu cầu</Button>
            </div>
        </form>
    );
}
