import React from 'react';
import Layout from '@/components/Layout';

// Site group layout: wraps non-admin pages with the existing shared Layout.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}

export const dynamic = 'force-dynamic';
