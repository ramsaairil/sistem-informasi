'use client';

import React, { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const supabase = createSupabaseBrowserClient();
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  // --- FETCH DATA ---
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id,
          date,
          start_time,
          courses ( name ),
          rooms!schedules_room_id_fkey ( name )
        `)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);

    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  // --- LOGIKA KALENDER ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const emptyDays = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDate = `${year}-${month}-${dayStr}`;
    return events.filter(e => e.date === targetDate);
  };

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans">
      {/* Container lebih kecil (max-w-5xl) dan padding dikurangi */}
      <div className="max-w-5xl mx-auto px-6 py-5">
        
        {/* HEADER COMPACT */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#F7F7F5] p-2 rounded-md text-[#37352f]">
               <CalendarIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#37352f] leading-tight">
                Kalender Akademik
              </h1>
              <p className="text-xs text-[#787774]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>
            </div>
          </div>

          {/* Controls Mini */}
          <div className="flex items-center gap-2">
            <button onClick={goToToday} className="text-[11px] font-medium px-2 py-1 border border-[#E9E9E7] rounded hover:bg-[#F7F7F5] transition text-[#37352f]">
              Hari Ini
            </button>
            <div className="flex items-center border border-[#E9E9E7] rounded bg-white shadow-sm">
              <button onClick={prevMonth} className="p-1 hover:bg-[#F7F7F5] text-[#37352f]">
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 text-xs font-semibold min-w-[100px] text-center select-none text-[#37352f]">
                {monthNames[currentDate.getMonth()]}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-[#F7F7F5] text-[#37352f]">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* KALENDER GRID */}
        <div className="border border-[#E9E9E7] rounded overflow-hidden bg-white">
          
          {/* Header Hari */}
          <div className="grid grid-cols-7 bg-[#F9F9F8] border-b border-[#E9E9E7]">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div key={day} className="py-1.5 text-center text-[10px] font-semibold text-[#9B9A97] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Body Tanggal */}
          {loading ? (
             <div className="h-60 flex justify-center items-center">
               <Loader2 className="animate-spin text-gray-300" size={24} />
             </div>
          ) : (
            <div className="grid grid-cols-7 auto-rows-fr bg-[#E9E9E7] gap-[1px]">
              
              {/* Empty Days */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="bg-[#FBFBFA] min-h-[80px]"></div>
              ))}

              {/* Real Days */}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isToday = 
                  day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() && 
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  // Tinggi minimal 80px (sangat compact)
                  <div key={day} className={`bg-white min-h-[80px] p-1.5 hover:bg-[#F7F7F5] transition-colors group relative flex flex-col`}>
                    
                    {/* Tanggal */}
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-sm
                        ${isToday ? 'bg-[#EB5757] text-white shadow-sm' : 'text-[#37352f] opacity-60'}`}>
                        {day}
                      </span>
                    </div>

                    {/* List Event Compact */}
                    <div className="flex-1 space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => ( 
                        <div key={ev.id} className="bg-[#F0F0EF] hover:bg-[#E0E0DF] rounded-[2px] px-1.5 py-0.5 cursor-pointer flex items-center gap-1.5 transition">
                          
                          {/* Dot status warna */}
                          <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0"></div>
                          
                          <div className="flex-1 min-w-0 flex items-center justify-between">
                            <span className="text-[10px] text-[#37352f] font-medium truncate leading-none">
                                {ev.courses?.name || 'Kegiatan'}
                            </span>
                            <span className="text-[9px] text-[#9B9A97] font-mono leading-none ml-1">
                                {ev.start_time?.slice(0,5)}
                            </span>
                          </div>

                        </div>
                      ))}
                      
                      {/* Indikator sisa */}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] text-[#9B9A97] pl-1 font-medium">
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}