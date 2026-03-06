import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostCardLoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 w-full">
            <Skeleton circle width={48} height={48} />
            <div className="flex-1">
              <Skeleton width={120} height={16} className="mb-1" />
              <div className="mt-1">
                <Skeleton width={80} height={12} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton circle width={34} height={34} />
            <Skeleton circle width={34} height={34} />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Skeleton count={2} className="mb-1" />
        <Skeleton width="60%" className="mb-3" />
      </div>

      <div className="my-3">
        <Skeleton height={384} borderRadius={0} style={{ display: 'block' }} />
      </div>

      <div className="px-4 py-2 border-b border-gray-100">
        <Skeleton width={80} height={14} />
      </div>

      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between gap-2">
        <div className="flex-1">
          <Skeleton height={36} borderRadius={4} />
        </div>
        <div className="flex-1">
          <Skeleton height={36} borderRadius={4} />
        </div>
        <div className="flex-1">
          <Skeleton height={36} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}