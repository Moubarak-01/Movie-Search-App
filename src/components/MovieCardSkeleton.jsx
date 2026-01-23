import React from 'react'

const MovieCardSkeleton = () => {
    return (
        <div className="movie-card animate-pulse flex flex-col h-full min-h-[280px]">
            {/* Poster Skeleton */}
            <div className="w-full aspect-[2/3] bg-gray-700/50 rounded-lg mb-4"></div>

            <div className="flex-1 flex flex-col justify-end">
                {/* Title Skeleton */}
                <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-3"></div>

                {/* Rating/Metadata Skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-gray-700/50 rounded"></div>
                    <div className="h-4 w-4 bg-gray-700/50 rounded-full"></div>
                    <div className="h-4 w-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 w-4 bg-gray-700/50 rounded-full"></div>
                    <div className="h-4 w-12 bg-gray-700/50 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default MovieCardSkeleton
