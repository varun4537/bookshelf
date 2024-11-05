import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const BookCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex gap-4">
      <Skeleton className="w-24 h-36" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const BookDetailsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
    <div className="flex justify-between">
      <div className="space-y-3 flex-1">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-x-2">
        <Skeleton className="h-10 w-10 inline-block" />
        <Skeleton className="h-10 w-10 inline-block" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-48 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

const SearchSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full max-w-md" />
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-24" />
      ))}
    </div>
  </div>
);

export { 
  Skeleton, 
  BookCardSkeleton, 
  BookDetailsSkeleton,
  SearchSkeleton
};