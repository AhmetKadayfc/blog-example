'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApiClient from '@/lib/api-client';

interface BlogActionsProps {
    blogId: number;
    isOwner: boolean;
    onDelete: () => void;
}

export function BlogActions({ blogId, isOwner, onDelete }: BlogActionsProps) {
    const router = useRouter();

    if (!isOwner) return null;

    return (
        <div className="flex gap-2 flex-shrink-0">
            <button
                onClick={() => router.push(`/edit/${blogId}`)}
                className="px-4 py-2 border-2 border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
                Edit
            </button>
            <button
                onClick={onDelete}
                className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
                Delete
            </button>
        </div>
    );
}
