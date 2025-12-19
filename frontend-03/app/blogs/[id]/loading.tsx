export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-5">
            <div className="max-w-4xl mx-auto py-10">
                <div className="mb-10 pb-8 border-b-2 border-gray-200 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-3/4 mb-5"></div>
                    <div className="flex gap-5">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        </div>
    );
}
