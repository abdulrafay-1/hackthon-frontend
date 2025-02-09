import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const PostCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#e4e4e4" highlightColor="#f4f4f4">
            <div className="space-y-6">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex gap-3">
                            <Skeleton circle width={40} height={40} />
                            <div>
                                <Skeleton width={100} height={15} />
                                <Skeleton width={150} height={15} style={{ marginTop: "5px" }} />
                            </div>
                        </div>
                        <Skeleton height={200} className="my-4" />
                        <Skeleton height={20} width={100} />
                        <Skeleton height={40} className="mt-4" />
                    </div>
                ))}
            </div>
        </SkeletonTheme>)
}

export default PostCardSkeleton