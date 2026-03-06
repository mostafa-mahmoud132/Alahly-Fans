import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NotificationSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <li key={i} className="p-4 flex gap-4 items-start animate-pulse">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width="40%" height={16} className="mb-2" />
              <Skeleton width="20%" height={12} />
            </div>
            <div className="mt-2">
              <Skeleton circle width={10} height={10} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
