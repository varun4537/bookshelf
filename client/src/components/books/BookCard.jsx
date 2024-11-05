import React from 'react';
import { Heart, Share2 } from 'lucide-react';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex gap-4">
          <img
            src={book.coverImage || "/api/placeholder/120/180"}
            alt={book.title}
            className="w-24 h-36 object-cover rounded"
          />
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">{book.genre}</div>
            <h3 className="font-medium text-slate-800 mb-1">{book.title}</h3>
            <p className="text-slate-600 text-sm mb-2">{book.author}</p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                {book.status}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="text-slate-400 hover:text-red-500">
                <Heart size={18} />
              </button>
              <button className="text-slate-400 hover:text-blue-500">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;