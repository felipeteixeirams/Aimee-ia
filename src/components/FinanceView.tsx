import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Shield, Plus, Target, Plane, GraduationCap, Home, AlertCircle, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction, FinancialGoal, UserProfile, Period, Tab } from '../types';
import { cn } from '../lib/utils';
import React, { useMemo } from 'react';

interface FinanceViewProps {
  profile: UserProfile | null;
  transactions: Transaction[];
  transactionsByPeriod: Transaction[];
  financePeriod: Period;
  setFinancePeriod: (period: Period) => void;
  financeCategory: string;
  setFinanceCategory: (category: string) => void;
  totalIncome: number;
  totalExpense: number;
  chartData: any[];
  categoryData: any[];
  behaviorData: any[];
  goals: FinancialGoal[];
  categories: string[];
  isDarkMode: boolean;
  filteredTransactions: Transaction[];
  financeStartDate: string;
  setFinanceStartDate: (date: string) => void;
  financeEndDate: string;
  setFinanceEndDate: (date: string) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const FinanceView = ({
  profile,
  transactions,
  transactionsByPeriod,
  financePeriod,
  setFinancePeriod,
  financeStartDate,
  setFinanceStartDate,
  financeEndDate,
  setFinanceEndDate,
  financeCategory,
  setFinanceCategory,
  totalIncome,
  totalExpense,
  chartData,
  categoryData,
  behaviorData,
  goals,
  categories,
  isDarkMode,
  filteredTransactions
}: FinanceViewProps) => {
  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'renovation': return <Home className="w-5 h-5" />;
      case 'emergency': return <AlertCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <motion.div 
      key="finance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-8 no-scrollbar"
    >
      {/* Gamification & Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-brand to-indigo-600 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Nível {profile?.gamification?.level || 1}</p>
                  <p className="text-base md:text-lg font-black tracking-tight leading-none md:leading-normal">Mestre das Finanças</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Pontos</p>
                <p className="text-lg md:text-xl font-black">{profile?.gamification?.points || 0}</p>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                <span>Progresso do Nível</span>
                <span>{(profile?.gamification?.points || 0) % 100}%</span>
              </div>
              <div className="h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(profile?.gamification?.points || 0) % 100}%` }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-brand" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Meta Semanal</p>
                <p className="text-base md:text-lg font-black text-neutral-800 dark:text-white tracking-tight">R$ {profile?.gamification?.weeklyGoal || 500}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Gasto Atual</p>
              <p className={cn(
                "text-lg md:text-xl font-black",
                (profile?.gamification?.currentWeeklySpending || 0) > (profile?.gamification?.weeklyGoal || 500) ? "text-rose-500" : "text-emerald-500"
              )}>
                R$ {profile?.gamification?.currentWeeklySpending || 0}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <span>Uso do Orçamento</span>
              <span>{Math.min(100, Math.round(((profile?.gamification?.currentWeeklySpending || 0) / (profile?.gamification?.weeklyGoal || 500)) * 100))}%</span>
            </div>
            <div className="h-1.5 md:h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((profile?.gamification?.currentWeeklySpending || 0) / (profile?.gamification?.weeklyGoal || 500)) * 100)}%` }}
                className={cn(
                  "h-full rounded-full",
                  (profile?.gamification?.currentWeeklySpending || 0) > (profile?.gamification?.weeklyGoal || 500) ? "bg-rose-500" : "bg-brand"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Graphical Dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Evolução Diária</h4>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Gastos por Categoria</h4>
            <PieChart className="w-4 h-4 text-brand" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goals & Behavior Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavioral Analysis */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Padrão Semanal</h4>
            <TrendingUp className="w-4 h-4 text-brand" />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                  {behaviorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? COLORS[index % COLORS.length] : '#f3f4f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[10px] text-neutral-400 font-medium leading-relaxed">
            Seus gastos tendem a se concentrar nos fins de semana. Considere planejar melhor suas compras de lazer.
          </p>
        </div>

        {/* Financial Goals */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider">Metas de Longo Prazo</h4>
            <button className="text-brand hover:bg-brand/10 p-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal, i) => (
              <div key={goal.id || i} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-sm text-brand">
                    {getGoalIcon(goal.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-neutral-800 dark:text-white truncate">{goal.title}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                      R$ {goal.currentAmount} / R$ {goal.targetAmount}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                      className="h-full bg-brand rounded-full"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-brand text-right uppercase tracking-widest">
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% concluído
                  </p>
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <div className="col-span-full py-10 text-center">
                <Target className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                <p className="text-xs text-neutral-400">Nenhuma meta criada. Peça para a Aimee ajudar!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benchmarking Alert */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h5 className="text-sm font-black text-amber-900 dark:text-amber-100 mb-1">Benchmarking Familiar</h5>
          <p className="text-xs text-amber-800/70 dark:text-amber-200/60 leading-relaxed">
            Notei que seus gastos com **Delivery** estão 15% acima da média regional para famílias do seu perfil em {profile?.location?.city || 'sua cidade'}. 
            Que tal um desafio de cozinhar em casa este final de semana?
          </p>
        </div>
      </div>

      {/* Bento Grid: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-emerald-500 p-4 md:p-5 rounded-[2rem] text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Total Ganhos</p>
              <p className="text-xl md:text-2xl font-black leading-tight">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-rose-500 p-4 md:p-5 rounded-[2rem] text-white shadow-lg shadow-rose-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative z-10 flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
              <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Total Gastos</p>
              <p className="text-xl md:text-2xl font-black leading-tight">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="sm:col-span-2 md:col-span-1 bg-white dark:bg-neutral-900 p-4 md:p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-center"
        >
          <p className="text-[8px] md:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Saldo Atual</p>
          <p className={cn(
            "text-xl md:text-2xl font-black leading-tight",
            (totalIncome - totalExpense) >= 0 ? "text-emerald-500" : "text-rose-500"
          )}>
            R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", (totalIncome - totalExpense) >= 0 ? "bg-emerald-500" : "bg-rose-500")} />
            <span className="text-[8px] md:text-[9px] font-bold text-neutral-400 uppercase">Status da Conta</span>
          </div>
        </motion.div>
      </div>

      {/* Period & Date Selection */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider mb-2">Período de Visualização</h3>
            <div className="flex flex-wrap gap-2">
              {(['7d', '30d', 'all', 'custom'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFinancePeriod(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm capitalize",
                    financePeriod === p 
                      ? "bg-brand border-brand text-brand-foreground" 
                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                  )}
                >
                  {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === 'all' ? 'Tudo' : 'Customizado'}
                </button>
              ))}
            </div>
          </div>
          
          <AnimatePresence>
            {financePeriod === 'custom' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase px-1">Início</label>
                  <input 
                    type="date"
                    value={financeStartDate}
                    onChange={(e) => setFinanceStartDate(e.target.value)}
                    className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand/50 transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase px-1">Fim</label>
                  <input 
                    type="date"
                    value={financeEndDate}
                    onChange={(e) => setFinanceEndDate(e.target.value)}
                    className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand/50 transition-all dark:text-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Filter - Horizontal Scroll */}
        <div>
          <h3 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-wider mb-4">Filtrar por Categoria</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
            <button
              onClick={() => setFinanceCategory('all')}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm",
                financeCategory === 'all' 
                  ? "bg-brand border-brand text-brand-foreground scale-105" 
                  : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
              )}
            >
              Todas Categorias
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFinanceCategory(cat)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm",
                  financeCategory === cat 
                    ? "bg-brand border-brand text-brand-foreground scale-105" 
                    : "bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-brand/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black tracking-tight">Transações Recentes</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
              {filteredTransactions.length} itens
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-24">
          {filteredTransactions.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
                  t.type === 'income' 
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                    : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                )}>
                  {t.type === 'income' ? <TrendingUp className="w-5 h-5 md:w-6 md:h-6" /> : <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-neutral-800 dark:text-neutral-100 truncate">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase truncate max-w-[80px]">{t.category}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
                    <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase shrink-0">{format(new Date(t.date), 'dd MMM', { locale: ptBR })}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className={cn("text-sm md:text-base font-black whitespace-nowrap", t.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[8px] md:text-[9px] font-bold text-neutral-300 dark:text-neutral-600 uppercase">Confirmado</p>
              </div>
            </motion.div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="col-span-full text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-[3rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800">
              <Wallet className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
