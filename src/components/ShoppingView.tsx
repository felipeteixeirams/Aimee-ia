import { motion } from 'motion/react';
import { ShoppingCart, Plus, CheckCircle2, Circle, Leaf, Package, Trash2, Apple } from 'lucide-react';
import { ShoppingItem, UserProfile } from '../types';
import { cn } from '../lib/utils';
import React from 'react';

interface ShoppingViewProps {
  shoppingFilter: 'list' | 'stock';
  setShoppingFilter: (filter: 'list' | 'stock') => void;
  shoppingList: ShoppingItem[];
  handleToggleShoppingItem: (item: ShoppingItem) => void;
  handleMoveToStock: (item: ShoppingItem) => void;
  handleMoveToList: (item: ShoppingItem) => void;
  handleDeleteShoppingItem: (item: ShoppingItem) => void;
  profile: UserProfile | null;
}

export const ShoppingView = ({
  shoppingFilter,
  setShoppingFilter,
  shoppingList,
  handleToggleShoppingItem,
  handleMoveToStock,
  handleMoveToList,
  handleDeleteShoppingItem,
  profile
}: ShoppingViewProps) => {
  return (
    <motion.div 
      key="shopping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">
            {shoppingFilter === 'list' ? 'Lista de Compras' : 'Estoque Doméstico'}
          </h3>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            {shoppingList.filter(i => shoppingFilter === 'stock' ? i.isStock : !i.isStock).length} itens encontrados
          </p>
        </div>
        <button className="w-10 h-10 bg-brand text-brand-foreground rounded-xl flex items-center justify-center shadow-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
        <button 
          onClick={() => setShoppingFilter('list')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
            shoppingFilter === 'list' ? "bg-white dark:bg-neutral-700 shadow-sm text-brand" : "text-neutral-400"
          )}
        >
          Lista
        </button>
        <button 
          onClick={() => setShoppingFilter('stock')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
            shoppingFilter === 'stock' ? "bg-white dark:bg-neutral-700 shadow-sm text-brand" : "text-neutral-400"
          )}
        >
          Estoque
        </button>
      </div>

      <div className="space-y-3">
        {shoppingList
          .filter(item => shoppingFilter === 'stock' ? item.isStock : !item.isStock)
          .sort((a, b) => {
            const urgencyMap = { high: 0, medium: 1, low: 2 };
            return (urgencyMap[a.urgency || 'medium'] || 1) - (urgencyMap[b.urgency || 'medium'] || 1);
          })
          .map((item, i) => (
          <div key={item.id || i} className={cn(
            "bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm transition-all hover:shadow-md group",
            item.purchased && "opacity-50 grayscale"
          )}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={() => handleToggleShoppingItem(item)}
                className="text-neutral-300 dark:text-neutral-700 hover:text-brand transition-colors shrink-0"
              >
                {item.purchased ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-black text-neutral-800 dark:text-neutral-100 truncate", item.purchased && "line-through")}>
                    {item.name}
                  </p>
                  {item.urgency === 'high' && !item.isStock && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {item.isEcoFriendly && (
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {item.category} • Qtd: {item.quantity}
                  </p>
                  {item.frequency && item.frequency > 2 && (
                    <span className="text-[8px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-bold uppercase">Recorrente</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {shoppingFilter === 'list' ? (
                <button 
                  onClick={() => handleMoveToStock(item)}
                  className="p-1.5 md:p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-neutral-400 hover:text-brand transition-colors"
                  title="Mover para Estoque"
                >
                  <Package className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => handleMoveToList(item)}
                  className="p-1.5 md:p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-neutral-400 hover:text-brand transition-colors"
                  title="Mover para Lista"
                >
                  <ShoppingCart className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </button>
              )}
              <button 
                onClick={() => handleDeleteShoppingItem(item)}
                className="p-1.5 md:p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
              </button>
            </div>
          </div>
        ))}
        {shoppingList.filter(i => shoppingFilter === 'stock' ? i.isStock : !i.isStock).length === 0 && (
          <div className="text-center py-20">
            {shoppingFilter === 'list' ? (
              <ShoppingCart className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            ) : (
              <Package className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            )}
            <p className="text-neutral-400 text-sm">
              {shoppingFilter === 'list' ? 'Sua lista está vazia.' : 'Seu estoque está vazio.'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-brand p-6 rounded-3xl text-brand-foreground shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Sugestões da Aimee</h4>
          <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-lg">
            <Apple className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">{profile?.healthGoals?.dietType === 'balanced' ? 'Dieta Balanceada' : 'Foco em Saúde'}</span>
          </div>
        </div>
        <div className="space-y-3">
          {shoppingList
            .filter(i => i.frequency && i.frequency > 3 && i.isStock)
            .slice(0, 2)
            .map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-brand-foreground/10 rounded-xl">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] opacity-60">Previsão: Acaba em 2 dias.</p>
                </div>
                <button 
                  onClick={() => handleMoveToList(item)}
                  className="p-2 hover:bg-brand-foreground/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          {shoppingList.filter(i => i.frequency && i.frequency > 3 && i.isStock).length === 0 && (
            <p className="text-xs opacity-60 italic">Continue usando para receber previsões de consumo e dicas nutricionais.</p>
          )}
        </div>
      </div>

      {profile?.healthGoals && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
              <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h5 className="text-sm font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Foco Nutricional</h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.healthGoals.focus.map((f, i) => (
              <span key={i} className="px-3 py-1 bg-white dark:bg-neutral-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800 shadow-sm">
                {f}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-emerald-800/70 dark:text-emerald-200/60 leading-relaxed">
            Aimee está priorizando itens com baixo índice glicêmico e proteínas magras para sua lista.
          </p>
        </div>
      )}
    </motion.div>
  );
};
