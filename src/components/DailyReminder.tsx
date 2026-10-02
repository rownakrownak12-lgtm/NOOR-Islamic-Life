import React, { useState } from 'react';
import { Sparkles, BellRing, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Reminder } from '../types/islamic';

interface DailyReminderProps {
  reminders: Reminder[];
}

export const DailyReminder: React.FC<DailyReminderProps> = ({ reminders }) => {
  const activeReminders = reminders.filter(r => r.active);
  const [index, setIndex] = useState(0);

  if (activeReminders.length === 0) return null;

  const current = activeReminders[index % activeReminders.length];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative glass-card rounded-2xl p-5 sm:p-6 border border-[#17C98B]/20 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        
        {/* Glow */}
        <div className="absolute left-0 top-0 w-2 h-full bg-[#17C98B]" />

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#17C98B]/15 text-[#17C98B] shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E7BD68] uppercase tracking-wider">
                আজকের ইসলামিক রিমাইন্ডার
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B] font-semibold">
                {current.category}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#F5FFF9] font-bengali mt-0.5">
              {current.banglaTitle}
            </h4>

            <p className="text-xs text-[#A7BEB3] font-bengali mt-1 max-w-3xl">
              {current.banglaContent}
            </p>
          </div>
        </div>

        {activeReminders.length > 1 && (
          <button
            onClick={() => setIndex(prev => (prev + 1) % activeReminders.length)}
            className="px-3.5 py-1.5 rounded-xl bg-[#06130F] border border-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B] text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>অন্য রিমাইন্ডার</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
};
