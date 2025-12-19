export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-5">
            <div className="text-center py-20">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
        </div>
    );
}
