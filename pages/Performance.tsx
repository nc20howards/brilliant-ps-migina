
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StorageService } from '../services/storageService';
import { StudentPerformance } from '../types';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Icons } from '../constants';

const PerformanceCard: React.FC<{ perf: StudentPerformance; fixedWidth?: boolean }> = ({ perf, fixedWidth = false }) => (
  <Card className={`flex flex-row p-4 items-center gap-4 hover:border-blue-300 transition bg-white border-gray-200 ${fixedWidth ? 'w-[320px] min-w-[320px]' : 'w-full'}`}>
    <img 
      src={perf.photoUrl || "https://picsum.photos/200"} 
      alt={perf.studentName} 
      loading="lazy"
      className="w-20 h-20 rounded-full object-cover bg-gray-200 flex-shrink-0" 
    />
    <div className="overflow-hidden">
      <p className="text-sm font-bold text-blue-600 mb-1">{perf.year}</p>
      <h4 className="text-lg font-bold text-gray-900 truncate">{perf.studentName}</h4>
      <p className="text-sm text-gray-500 truncate">{perf.achievements}</p>
      <div className="mt-2 inline-block bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-700">
        AGG: {perf.agg}
      </div>
    </div>
  </Card>
);

const Performance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setPerformanceData(StorageService.getPerformance());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const currentYear = new Date().getFullYear();
  const hasFutureData = performanceData.some(p => p.year > currentYear);

  // Prepare chart data
  const chartData = performanceData
    .sort((a, b) => a.year - b.year)
    .map(p => ({
      year: p.year,
      agg: p.agg,
      student: p.studentName
    }));

  // Extract unique years for dropdown
  const availableYears: number[] = Array.from<number>(new Set(performanceData.map(p => p.year)))
    .sort((a: number, b: number) => b - a);

  // Filter Logic
  const displayedPerformers = performanceData.filter(p => {
    // Year filter
    let matchesYear = true;
    if (selectedYear === 'upcoming') {
      matchesYear = p.year > currentYear;
    } else if (selectedYear !== 'All') {
      matchesYear = p.year.toString() === selectedYear;
    }

    // Search filter
    const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesYear && matchesSearch;
  }).sort((a, b) => b.year - a.year);

  // Determine view mode: Marquee only when All years selected and no search active
  const isMarqueeView = selectedYear === 'All' && !searchQuery && displayedPerformers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Academic Excellence</h2>
        <p className="mt-2 text-gray-600">Honoring our top performers through the years.</p>
      </div>

      {/* Chart Section */}
      <div className="mb-16">
        <Card className="p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Valedictorian Performance Trends</h3>
          <div className="h-[300px] md:h-[400px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f3f4f6'}}
                  />
                  <Legend />
                  <Bar dataKey="agg" name="Best Aggregate" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Hall of Fame Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-gray-900">Wall of Fame</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icons.Search />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition shadow-sm"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <select 
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 sm:w-48 shadow-sm"
          >
            <option value="All">All Years</option>
            {hasFutureData && <option value="upcoming">Upcoming Years</option>}
            {availableYears.map((year: number) => (
              <option key={year} value={year}>
                {year} {year > currentYear ? '(Upcoming)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hall of Fame Display */}
      {isLoading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
               <Card key={i} className="flex flex-row p-4 items-center gap-4 bg-white border-gray-200">
                  <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
               </Card>
            ))}
         </div>
      ) : isMarqueeView ? (
        /* Marquee View */
        <div className="relative overflow-hidden py-4 -mx-4 px-4 md:mx-0 md:px-0 bg-gradient-to-r from-transparent via-white/50 to-transparent">
           <div className="flex w-max gap-6 animate-marquee hover:pause">
             {/* Repeat list multiple times to create seamless loop effect */}
             {[...displayedPerformers, ...displayedPerformers, ...displayedPerformers].map((perf, index) => (
               <PerformanceCard key={`${perf.id}-${index}`} perf={perf} fixedWidth={true} />
             ))}
           </div>
        </div>
      ) : (
        /* Static Grid View (Filtered or Search Results) */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {displayedPerformers.map((perf) => (
            <PerformanceCard key={perf.id} perf={perf} />
          ))}
          {displayedPerformers.length === 0 && (
             <div className="col-span-full text-center py-12">
               <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <Icons.Search />
               </div>
               <p className="text-gray-500 text-lg">No records found matching your criteria.</p>
               {(searchQuery || selectedYear !== 'All') && (
                 <button 
                    onClick={() => {setSearchQuery(''); setSelectedYear('All');}}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                 >
                    Clear filters
                 </button>
               )}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Performance;
