'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ApiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export function CreateBlogButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(ApiClient.isAuthenticated());
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Link href="/create">
            <Button className="rounded-lg">
                Create New Blog
            </Button>
        </Link>
    );
}
