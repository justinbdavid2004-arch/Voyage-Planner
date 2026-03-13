import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Utensils, 
  Hotel, 
  Briefcase, 
  Info, 
  ChevronRight, 
  Navigation,
  Loader2,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateTravelPlan, TravelPlan } from './services/geminiService';

export default function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateTravelPlan(destination, days, people);
      setPlan(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setDestination('');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans">
      <AnimatePresence mode="wait">
        {!plan ? (
          <motion.div 
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto pt-20 px-6"
          >
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-serif italic mb-4"
              >
                Voyage Planner
              </motion.h1>
              <p className="text-[#5A5A40] text-lg">Your AI-powered travel companion for the perfect trip.</p>
            </div>

            <form onSubmit={handleSearch} className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#5A5A40] mb-2">Where to?</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40] w-5 h-5" />
                    <input 
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination (e.g., Kyoto, Japan)"
                      className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-[#5A5A40] mb-2">Duration (Days)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40] w-5 h-5" />
                      <input 
                        type="number"
                        min="1"
                        max="14"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-[#5A5A40] mb-2">People</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40] w-5 h-5" />
                      <input 
                        type="number"
                        min="1"
                        value={people}
                        onChange={(e) => setPeople(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Crafting your itinerary...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Plan My Trip
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-[#5A5A40] mb-8 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Summary & Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                  <h2 className="text-3xl font-serif italic mb-2">{plan.destination}</h2>
                  <div className="flex items-center gap-4 text-[#5A5A40] text-sm mb-6">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {plan.duration} Days</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {plan.people} People</span>
                  </div>
                  <div className="p-4 bg-[#F5F5F0] rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-[#5A5A40]">
                      <Navigation className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Route Summary</span>
                    </div>
                    <p className="text-sm leading-relaxed">{plan.routeSummary}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-5 h-5 text-[#5A5A40]" />
                    <h3 className="text-lg font-serif italic">Food Recommendations</h3>
                  </div>
                  <div className="space-y-4">
                    {plan.foodRecommendations.map((food, i) => (
                      <div key={i} className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-xs text-[#5A5A40] uppercase tracking-wider mb-1">{food.cuisine}</p>
                          </div>
                          {food.mapUrl && (
                            <a 
                              href={food.mapUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 bg-[#F5F5F0] rounded-lg text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-colors"
                              title="View on Google Maps"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-[#5A5A40]">{food.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Hotel className="w-5 h-5 text-[#5A5A40]" />
                    <h3 className="text-lg font-serif italic">Stay Suggestions</h3>
                  </div>
                  <div className="space-y-4">
                    {plan.staySuggestions.map((stay, i) => (
                      <div key={i} className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{stay.type}</p>
                            <p className="text-xs text-[#5A5A40] uppercase tracking-wider mb-1">{stay.area}</p>
                          </div>
                          {stay.bookingUrl && (
                            <a 
                              href={stay.bookingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 bg-[#F5F5F0] rounded-lg text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-colors"
                              title="Book Now"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-[#5A5A40]">{stay.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Itinerary */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-8">
                    <Clock className="w-6 h-6 text-[#5A5A40]" />
                    <h3 className="text-2xl font-serif italic">Daily Itinerary</h3>
                  </div>

                  <div className="space-y-12">
                    {plan.itinerary.map((day) => (
                      <div key={day.day} className="relative pl-8 border-l-2 border-[#5A5A40]/10">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#5A5A40]" />
                        <h4 className="text-xl font-serif italic mb-6">Day {day.day}</h4>
                        <div className="space-y-8">
                          {day.activities.map((activity, i) => (
                            <div key={i} className="flex gap-4 group">
                              <div className="min-w-[80px] text-sm font-mono text-[#5A5A40]">{activity.time}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold">{activity.location}</p>
                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                      activity.type === 'sightseeing' ? 'bg-blue-100 text-blue-700' :
                                      activity.type === 'food' ? 'bg-orange-100 text-orange-700' :
                                      activity.type === 'travel' ? 'bg-green-100 text-green-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {activity.type}
                                    </span>
                                  </div>
                                  {activity.mapUrl && (
                                    <a 
                                      href={activity.mapUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#F5F5F0] rounded-lg text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all"
                                      title="View on Google Maps"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-[#5A5A40]">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-[#5A5A40]" />
                      <h3 className="text-lg font-serif italic">Packing List</h3>
                    </div>
                    <ul className="space-y-2">
                      {plan.packingList.map((item, i) => (
                        <li key={i} className="text-sm text-[#5A5A40] flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#5A5A40]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-[#5A5A40]" />
                      <h3 className="text-lg font-serif italic">Essential Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {plan.essentialTips.map((tip, i) => (
                        <li key={i} className="text-sm text-[#5A5A40] flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#5A5A40] mt-2 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
