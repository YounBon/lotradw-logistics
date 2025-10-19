import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import KPIBar from '@/components/landing/KPIBar';
import Roles from '@/components/landing/Roles';
import ContactForm from '@/components/landing/ContactForm';
import FooterLanding from '@/components/landing/FooterLanding';
import Testimonials from '@/components/landing/Testimonials';
import CaseStudies from '@/components/landing/CaseStudies';
import FAQ from '@/components/landing/FAQ';
import CtaSection from '@/components/landing/CtaSection';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <Header />
            <main>
                <Hero />
                <Features />
                <KPIBar />
                <Roles />
                <CaseStudies />
                <Testimonials />
                <FAQ />

                <CtaSection />

                <section id="contact" className="py-16">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Muốn biết LoTraDW giúp doanh nghiệp của bạn như thế nào?</h2>
                            <p className="text-gray-600 mb-6">Để lại thông tin, chúng tôi sẽ liên hệ tư vấn giải pháp phù hợp với quy mô và mô hình vận tải của bạn.</p>
                            <ContactForm />
                        </div>

                        <div className="flex items-center justify-center">
                            <img src="/images/landing/illustration.png" alt="Minh họa quản lý vận tải" className="rounded shadow max-w-full" />
                        </div>
                    </div>
                </section>
            </main>

            <FooterLanding />
        </div>
    );
}
