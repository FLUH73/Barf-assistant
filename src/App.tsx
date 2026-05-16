
import React, { useState, useMemo } from 'react';
import { 
  Dog, 
  Scale, 
  PieChart, 
  Calendar, 
  ShoppingBag, 
  Plus, 
  Copy, 
  Check, 
  Info,
  Droplets,
  Egg,
  Fish,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

const DAYS = [
  { id: 'mon', label: 'MON', icon: <Droplets className="w-3 h-3 text-sky-400" />, tip: 'Oil' },
  { id: 'tue', label: 'TUE', icon: <Egg className="w-3 h-3 text-amber-500" />, tip: 'Egg' },
  { id: 'wed', label: 'WED', icon: <Droplets className="w-3 h-3 text-sky-400" />, tip: 'Oil' },
  { id: 'thu', label: 'THU', icon: null, tip: 'Normal' },
  { id: 'fri', label: 'FRI', icon: <Fish className="w-3 h-3 text-sky-400" />, tip: 'Fish' },
  { id: 'sat', label: 'SAT', icon: <Egg className="w-3 h-3 text-amber-500" />, tip: 'Egg' },
  { id: 'sun', label: 'SUN', icon: <Zap className="w-3 h-3 text-rose-500" />, tip: 'FAST', isFasting: true },
];

const RATIO_KEYS = ['bone', 'mainMenu', 'muscleMeat', 'liver', 'otherOffal'] as const;
type RatioKey = typeof RATIO_KEYS[number];

interface Ratios {
  bone: number;
  mainMenu: number;
  muscleMeat: number;
  liver: number;
  otherOffal: number;
}

// --- Main Component ---

export default function App() {
  // State
  const [weight, setWeight] = useState<number>(26.4);
  const [dailyPercentage, setDailyPercentage] = useState<number>(2.5);
  const [ratios, setRatios] = useState<Ratios>({
    bone: 20,
    mainMenu: 50,
    muscleMeat: 20,
    liver: 5,
    otherOffal: 5
  });
  const [fiberPercentage, setFiberPercentage] = useState<number>(10);
  const [isFastingSun, setIsFastingSun] = useState<boolean>(true);
  const [buyCycleDays, setBuyCycleDays] = useState<number>(26);

  // Products database (hypothetical, to make logic work)
  const [products, setProducts] = useState([
    { id: 'bone', title: '1. Bones', category: 'bone', name: 'Pecsenye kacsa farhát', unitWeightKg: 1, unitName: 'pcs' },
    { id: 'main', title: '2. Main Menu', category: 'mainMenu', name: 'Marha Menü Belsőséggel', unitWeightKg: 5, unitName: 'tub' },
    { id: 'muscle', title: '3. Muscle Meat', category: 'muscleMeat', name: 'Pulykaszív', unitWeightKg: 0.5, unitName: 'pcs' },
    { id: 'organ', title: '4. Other Organs', category: 'organs', name: 'Bárány vegyes belsőség', unitWeightKg: 1, unitName: 'pcs' },
  ]);

  const [supplements, setSupplements] = useState([
    { name: 'Kelp / Barna Alga', amount: '0.5g', desc: 'Mandatory Iodine source', tag: null, color: null },
    { name: 'Collagen (Pure)', amount: '5.3g', desc: 'Joint & ligament support', tag: null, color: null },
    { name: 'Rosehip Powder', amount: '5.3g', desc: 'Vitamin C needed for Collagen', tag: 'Vibe Check', color: 'text-rose-400' },
    { name: 'Salmon Oil', amount: '5 Pumps', desc: 'Omega-3 support', tag: null, color: null },
  ]);

  // Calculations
  const totalAnimalPercentage = useMemo(() => {
    return RATIO_KEYS.reduce((acc, key) => acc + ratios[key], 0);
  }, [ratios]);

  const dailyTotalGrams = useMemo(() => {
    return Math.round(weight * dailyPercentage * 10);
  }, [weight, dailyPercentage]);

  const fiberGrams = useMemo(() => {
    return Math.round(dailyTotalGrams * (fiberPercentage / 100));
  }, [dailyTotalGrams, fiberPercentage]);

  const getGrams = (ratio: number) => Math.round(dailyTotalGrams * (ratio / 100));

  // Range adjustment logic for animal ratios
  const handleRatioChange = (key: RatioKey, value: number) => {
    const newVal = Math.max(0, value);
    const otherSum = totalAnimalPercentage - ratios[key];
    
    if (otherSum + newVal > 100) {
      // If exceeds 100, we clamp to remaining
      const allowed = 100 - otherSum;
      setRatios(prev => ({ ...prev, [key]: Math.max(0, allowed) }));
    } else {
      setRatios(prev => ({ ...prev, [key]: newVal }));
    }
  };

  // UI Helpers
  const formatKg = (grams: number) => (grams / 1000).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
              B
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase leading-none">
                Pro BARF Assistant
              </h1>
              <p className="text-slate-500 font-medium text-xs tracking-wide mt-1">
                v4.2 PROFESSIONAL <span className="mx-2">|</span> <span className="text-amber-500/80 uppercase">Active Adult Formula</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-1">Status</span>
              <span className={`text-xs font-bold uppercase tracking-tight ${totalAnimalPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalAnimalPercentage === 100 ? '100% Balanced' : `${totalAnimalPercentage}% Adjusted`}
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50 flex flex-col justify-center text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-1">Daily Target</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {dailyTotalGrams}g + {fiberGrams}g
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Settings */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Dog Profile */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Dog className="w-4 h-4 text-amber-500" />
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">Dog Profile</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Daily %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={dailyPercentage}
                    onChange={(e) => setDailyPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 mt-4">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Buy Cycle (Days)</label>
                  <input 
                    type="number" 
                    value={buyCycleDays}
                    onChange={(e) => setBuyCycleDays(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <label className="group flex items-center gap-3 p-3 mt-4 bg-slate-800/30 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isFastingSun}
                  onChange={(e) => setIsFastingSun(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                  Fasting Day (Sunday)
                </span>
              </label>
            </section>

            {/* Macro Ratios */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex-1 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-5">
                <PieChart className="w-4 h-4 text-amber-500" />
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">Macro Ratios</h2>
              </div>
              
              <div className="space-y-5">
                {[
                  { label: 'Bone', key: 'bone', color: 'bg-amber-500' },
                  { label: 'Main Menu', key: 'mainMenu', color: 'bg-amber-400' },
                  { label: 'Muscle Meat', key: 'muscleMeat', color: 'bg-amber-600' },
                  { label: 'Liver', key: 'liver', color: 'bg-rose-500' },
                  { label: 'Other Offal', key: 'otherOffal', color: 'bg-rose-600' },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-slate-400">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{ratios[item.key as RatioKey]}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${ratios[item.key as RatioKey]}%` }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={ratios[item.key as RatioKey]}
                      onChange={(e) => handleRatioChange(item.key as RatioKey, parseInt(e.target.value))}
                      className="w-full h-1 bg-transparent accent-amber-500 cursor-pointer appearance-none opacity-0 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
                
                <div className="pt-4 border-t border-slate-800 mt-2 space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-emerald-400 underline underline-offset-4 decoration-emerald-500/30">Fiber Additive</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">{fiberPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fiberPercentage}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="50"
                    value={fiberPercentage}
                    onChange={(e) => setFiberPercentage(parseInt(e.target.value))}
                    className="w-full h-1 bg-transparent accent-emerald-500 cursor-pointer appearance-none"
                  />
                </div>
              </div>
            </section>

            {/* Daily Summary Card */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl shadow-emerald-900/10">
              <p className="text-[10px] uppercase text-emerald-500 font-black tracking-widest mb-1">Daily Dish Total</p>
              <h3 className="text-4xl font-black text-emerald-400 mb-1">{dailyTotalGrams} g</h3>
              <p className="text-[10px] text-emerald-500/60 font-bold uppercase">+ {fiberGrams}g VEGGIE/FIBER MIX</p>
            </div>
          </aside>

          {/* Center Column: Categories & Calendar */}
          <section className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Component breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((card) => {
                let percentage = 0;
                let grams = 0;
                if (card.category === 'bone') {
                  percentage = ratios.bone;
                  grams = getGrams(ratios.bone);
                } else if (card.category === 'mainMenu') {
                  percentage = ratios.mainMenu;
                  grams = getGrams(ratios.mainMenu);
                } else if (card.category === 'muscleMeat') {
                  percentage = ratios.muscleMeat;
                  grams = getGrams(ratios.muscleMeat);
                } else if (card.category === 'organs') {
                  percentage = ratios.liver + ratios.otherOffal;
                  grams = getGrams(ratios.liver) + getGrams(ratios.otherOffal);
                }
                const monthlyKg = (grams * buyCycleDays) / 1000;
                const buyAmount = Math.ceil(monthlyKg / card.unitWeightKg);

                return (
                <motion.div 
                  key={card.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-tight">{card.title}</h3>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono font-bold">{percentage}%</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100 mb-4 truncate">{card.name}</div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-slate-800">
                      <span className="block text-[8px] text-slate-500 uppercase font-black mb-1">Daily</span>
                      <span className="text-xs font-bold text-slate-200">{grams}g</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-slate-800">
                      <span className="block text-[8px] text-slate-500 uppercase font-black mb-1">Cycle</span>
                      <span className="text-xs font-bold text-slate-200">{formatKg(grams * buyCycleDays)}kg</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-emerald-500/30">
                      <span className="block text-[8px] text-emerald-500 uppercase font-black mb-1">Buy</span>
                      <span className="text-xs font-bold text-emerald-400">{buyAmount} {card.unitName}</span>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>

            {/* Calendar */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col flex-1 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">Weekly Feeding Calendar</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-black uppercase">Week 42 Reminder</span>
                </div>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                {DAYS.map((day) => (
                  <div 
                    key={day.id} 
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                      day.isFasting 
                        ? 'bg-rose-500/10 border-rose-500/30' 
                        : day.tip !== 'Normal'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <span className={`text-[10px] font-black mb-2 ${day.isFasting ? 'text-rose-500' : 'text-slate-500'}`}>
                      {day.label}
                    </span>
                    <div className="mb-1">{day.icon || <div className="h-3" />}</div>
                    <span className={`text-[10px] font-bold ${day.isFasting ? 'text-rose-300 italic' : 'text-slate-300'}`}>
                      {day.tip}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/20 border-t border-slate-800/50 pt-5 flex flex-wrap gap-5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Salmon Oil
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 2-3 Eggs/Week
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 1 Fasting Day
                </div>
              </div>
            </section>
          </section>

          {/* Right Column: Supplements & Shopping */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            
              {/* Supplements */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col backdrop-blur-sm">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">Supplements</h2>
                </div>
              </div>
              
              <div className="space-y-3 flex-1 overflow-auto max-h-[400px] pr-2 scrollbar-none">
                {supplements.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-100">{item.name}</span>
                      <span className="text-[11px] font-bold text-amber-400">{item.amount}</span>
                    </div>
                    <div className={`text-[10px] leading-tight flex justify-between ${item.color || 'text-slate-500'}`}>
                      <span>{item.desc}</span>
                      {item.tag && <span className="uppercase text-[8px] font-black bg-rose-500/20 px-1 rounded">{item.tag}</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setSupplements([...supplements, { name: 'New Custom Item', amount: '?', desc: 'Edit me', tag: null, color: null }])} className="mt-4 w-full py-2.5 text-[10px] uppercase font-black tracking-widest text-slate-500 border border-dashed border-slate-800 rounded-xl hover:border-amber-500/50 hover:text-amber-500/70 transition-all">
                + Add Custom Item
              </button>
            </section>

            {/* Shopping List */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col flex-1 shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="p-5 flex justify-between items-center border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-amber-500 font-black">Shopping List</h2>
                </div>
                <button 
                  onClick={() => {
                    const list = [`Shopping List (for ${buyCycleDays} days):`];
                    products.forEach(p => {
                      let grams = 0;
                      if (p.category === 'bone') grams = getGrams(ratios.bone);
                      else if (p.category === 'mainMenu') grams = getGrams(ratios.mainMenu);
                      else if (p.category === 'muscleMeat') grams = getGrams(ratios.muscleMeat);
                      else if (p.category === 'organs') grams = getGrams(ratios.liver) + getGrams(ratios.otherOffal);
                      list.push(`- ${p.name}: ${formatKg(grams * buyCycleDays)}kg`);
                    });
                    supplements.forEach(s => {
                      list.push(`- ${s.name}: ${s.amount}`);
                    });
                    navigator.clipboard.writeText(list.join('\n'));
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-full"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              
              <div className="p-5 flex-1 space-y-2 font-mono text-xs leading-relaxed">
                {products.map(p => {
                  let grams = 0;
                  if (p.category === 'bone') grams = getGrams(ratios.bone);
                  else if (p.category === 'mainMenu') grams = getGrams(ratios.mainMenu);
                  else if (p.category === 'muscleMeat') grams = getGrams(ratios.muscleMeat);
                  else if (p.category === 'organs') grams = getGrams(ratios.liver) + getGrams(ratios.otherOffal);
                  return (
                    <div key={p.id} className="flex justify-between group">
                      <span className="text-slate-500 group-hover:text-slate-400 truncate pr-2" title={p.name}>{p.name}:</span> 
                      <span className="text-slate-200 font-bold whitespace-nowrap">{formatKg(grams * buyCycleDays)}kg</span>
                    </div>
                  );
                })}
                <div className="border-t border-slate-800 my-4 pt-4"></div>
                {supplements.slice(0, 2).map((s, idx) => (
                  <div key={idx} className="flex justify-between group">
                    <span className="text-sky-400/80 group-hover:text-sky-400 truncate pr-2">{s.name}:</span> 
                    <span className="text-slate-200 font-bold whitespace-nowrap">1 pc</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-900/80">
                <button 
                  onClick={() => alert(`Your daily limit is ${dailyTotalGrams}G. You are feeding for ${buyCycleDays} days.`)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-slate-950 font-black text-sm uppercase tracking-tight shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all"
                >
                  Generate Summary
                </button>
              </div>
            </section>
          </aside>
        </main>

        {/* Footer: Tips & Transition */}
        <footer className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center px-6 py-4 md:py-0 md:h-16 gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" />
              <span className="text-amber-500 font-black text-[11px] uppercase italic tracking-wider whitespace-nowrap">BARF Transition Tip:</span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { w: 'W1', t: '50/50 Bone/Meat' },
                { w: 'W2', t: 'Add 20% Veggies' },
                { w: 'W3', t: 'Add 10% Organs' },
                { w: 'W4', t: 'Full Balanced Mix' },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-[10px] font-bold ${i < 3 ? 'md:border-r border-slate-800' : ''}`}>
                  <b className="text-slate-500">{step.w}:</b> <span className="text-slate-300">{step.t}</span>
                </div>
              ))}
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="md:w-48 bg-amber-500/10 border border-amber-500/50 rounded-xl flex items-center justify-center p-4 md:p-0 text-[11px] font-black text-amber-500 uppercase cursor-pointer hover:bg-amber-500/20 transition-all tracking-widest text-center"
          >
            Help Guide
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
