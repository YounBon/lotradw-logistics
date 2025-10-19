export default function FooterLanding() {
    return (
        <footer className="bg-gradient-to-t from-white to-orange-50 border-t mt-16" style={{ fontFamily: 'Inter, "Noto Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
                <div>
                    <div className="text-xl text-orange-600" style={{ fontWeight: 700 }}>LoTraDW</div>
                    <div className="text-sm text-gray-600 mt-2">Hệ sinh thái quản lý vận tải và Kho dữ liệu</div>
                </div>

                <div>
                    <div className="font-medium mb-2">Văn phòng</div>
                    <div className="text-sm text-gray-600">TP. Hồ Chí Minh — 199C2 Nguyễn Văn Hưởng</div>
                    <div className="text-sm text-gray-600">Hà Nội — Số 4, ngách 6, ngõ 102</div>
                </div>

                <div>
                    <div className="font-medium mb-2">Liên hệ</div>
                    <div className="text-sm text-gray-600">0938 545 272</div>
                    <div className="text-sm text-gray-600">marketing@lotradw.local</div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-6 text-xs text-gray-500">© {new Date().getFullYear()} LoTraDW. Bản quyền thuộc về LoTraDW.</div>
        </footer>
    );
}
