import React from 'react';
import { BookOpen, Library, User, BookMarked, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={24} />
        <h1 className="text-xl font-semibold">BookShelf</h1>
      </div>

      <nav className="space-y-6">
        <div className="space-y-2">
          <div className="text-slate-400 text-sm">MENU</div>
          <div className="space-y-1">
            {[
              { name: 'Home', icon: <Library size={18} /> },
              { name: 'My Library', icon: <BookMarked size={18} /> },
              { name: 'Reading List', icon: <BookOpen size={18} /> },
              { name: 'Statistics', icon: <BarChart2 size={18} /> },
            ].map(item => (
              <button 
                key={item.name}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-3"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700">
          <User size={18} />
          <div>
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-slate-400">Premium Member</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;