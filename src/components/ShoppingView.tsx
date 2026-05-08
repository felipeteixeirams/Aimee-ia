import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, CheckCircle2, Circle, Leaf, Package, Trash2, Apple, MapPin, Navigation, Star, Search, X, Zap } from 'lucide-react';
import { ShoppingItem, UserProfile } from '../types/index.js';
import { cn } from '../lib/utils.js';
import React, { useState } from 'react';
import { locationService, MarketLocation } from '../services/locationService.js';

interface ShoppingViewProps {
  shoppingFilter: 'list' | 'stock';
  setShoppingFilter: (filter: 'list' | 'stock') => void;
  shoppingList: ShoppingItem[];
  handleToggleShoppingItem: (item: ShoppingItem, extra?: Partial<ShoppingItem>) => void;
  handleMoveToStock: (item: ShoppingItem) => void;
  handleMoveToList: (item: ShoppingItem) => void;
  handleDeleteShoppingItem: (item: ShoppingItem) => void;
  handleFinishShopping: () => void;
  handleAddItem: (item: Partial<ShoppingItem>) => void;
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
  handleFinishShopping,
  handleAddItem,
  profile
}: ShoppingViewProps) => {
  const [nearbyMarkets, setNearbyMarkets] = useState<MarketLocation[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('grocery');

  const onAddItem = () => {
    if (!newItemName.trim()) return;
    handleAddItem({
      name: newItemName,
      category: newItemCategory,
    });
    setNewItemName('');
    setShowAddForm(false);
  };

  const handleFindMarkets = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const position = await locationService.getCurrentPosition();
      const markets = await locationService.findNearbyMarkets(
        position.coords.latitude,
        position.coords.longitude
      );
      setNearbyMarkets(markets);
    } catch (error: any) {
      setLocationError(error.message || 'Erro ao buscar localização.');
    } finally {
      setIsLocating(false);
    }
  };

  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const [recordedPrices, setRecordedPrices] = useState<Record<string, number>>({});

  const cartTotal = Object.values(recordedPrices).reduce((acc, price) => acc + price, 0);

  const toggleShoppingMode = () => {
    setIsShoppingMode(!isShoppingMode);
    if (!isShoppingMode) {
      setRecordedPrices({});
    }
  };

  const handlePriceChange = (itemId: string, price: string) => {
    const numPrice = parseFloat(price.replace(',', '.'));
    if (!isNaN(numPrice)) {
      setRecordedPrices(prev => ({ ...prev, [itemId]: numPrice }));
    } else if (price === '') {
      const newPrices = { ...recordedPrices };
      delete newPrices[itemId];
      setRecordedPrices(newPrices);
    }
  };

  const onToggleWithLocation = async (item: ShoppingItem) => {
    let extra: Partial<ShoppingItem> = {};
    
    // Only capture if marking as purchased
    if (!item.purchased && isShoppingMode) {
      if (item.id && recordedPrices[item.id]) {
        extra.lastPrice = recordedPrices[item.id];
      }
      
      try {
        const pos = await locationService.getCurrentPosition();
        extra.latitude = pos.coords.latitude;
        extra.longitude = pos.coords.longitude;
      } catch (err) {
        console.warn('Silent geolocation failure:', err);
      }
    }
    
    handleToggleShoppingItem(item, extra);
  };

  if (isShoppingMode) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-32"
      >
        <div className="flex items-center justify-between bg-brand p-6 -mx-4 -mt-4 rounded-b-[3rem] shadow-xl shadow-brand/20 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleShoppingMode}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tighter">Modo Compra</h2>
              <p className="text-[10px] text-white/70 font-medium tracking-widest uppercase">Carrinho Ativo</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Total</p>
            <p className="text-2xl font-black text-white">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="space-y-3">
          {shoppingList.filter(item => !item.isStock).map((item) => (
            <motion.div 
              key={item.id}
              layout
              className={cn(
                "p-4 rounded-[2rem] border transition-all flex items-center gap-4 group",
                item.purchased 
                  ? "bg-neutral-50 dark:bg-neutral-900/40 border-neutral-100 dark:border-neutral-800 opacity-60" 
                  : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm"
              )}
            >
              <button 
                onClick={() => onToggleWithLocation(item)}
                className="shrink-0"
              >
                {item.purchased ? (
                  <CheckCircle2 className="w-6 h-6 text-brand" />
                ) : (
                  <Circle className="w-6 h-6 text-neutral-300" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-sm font-black dark:text-white block truncate mb-1",
                  item.purchased && "line-through text-neutral-400"
                )}>
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{item.quantity} {item.unit}</span>
                </div>
              </div>

              {!item.purchased && (
                <div className="relative w-24">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-400">R$</span>
                  <input 
                    type="text"
                    placeholder="0,00"
                    onChange={(e) => item.id && handlePriceChange(item.id, e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl pl-8 pr-3 py-2 text-xs font-black text-neutral-800 dark:text-white focus:ring-2 focus:ring-brand/30 outline-none"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {shoppingList.filter(item => !item.isStock).length > 0 && shoppingList.filter(item => !item.isStock).every(item => item.purchased) && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[320px] py-5 bg-brand text-brand-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/40 active:scale-95 transition-all text-sm mx-auto block"
            onClick={() => {
              handleFinishShopping();
              toggleShoppingMode();
            }}
          >
            Finalizar e Atualizar Estoque
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="shopping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6 pb-32"
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
        <div className="flex items-center gap-2">
          {shoppingFilter === 'list' && (
            <button 
              onClick={toggleShoppingMode}
              className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center transition-all hover:bg-brand/20 active:scale-95"
              title="Modo Compra"
            >
              <Zap className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-10 h-10 bg-brand text-brand-foreground rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <Plus className={cn("w-5 h-5 transition-transform", showAddForm && "rotate-45")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-white dark:bg-neutral-900 rounded-[2rem] border border-brand/20 shadow-xl shadow-brand/5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-brand uppercase tracking-widest px-1">Nome do Item</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: Leite, Pão, Maçã..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand/50 transition-all dark:text-white"
                  onKeyDown={(e) => e.key === 'Enter' && onAddItem()}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Categoria</label>
                  <select 
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand/50 transition-all dark:text-white"
                  >
                    <option value="grocery">Mercado</option>
                    <option value="pharmacy">Farmácia</option>
                    <option value="bakery">Padaria</option>
                    <option value="cleaning">Limpeza</option>
                    <option value="pet">Pet</option>
                    <option value="meat">Açougue</option>
                    <option value="others">Outros</option>
                  </select>
                </div>
                <button 
                  onClick={onAddItem}
                  className="mt-5 px-6 bg-brand text-brand-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20 active:scale-95 transition-all"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                onClick={() => onToggleWithLocation(item)}
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

        {/* Apple Music Style Suggestions at the end of List */}
        {shoppingFilter === 'list' && profile?.aimeeMetadata?.suggestions && profile.aimeeMetadata.suggestions.length > 0 && (
          <div className="pt-8 pb-4">
            <h4 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-4 pl-4 flex items-center gap-2">
              <Star className="w-3 h-3 fill-current" />
              Para Você
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {profile.aimeeMetadata.suggestions
                .filter(s => s.type === 'shopping')
                .map((suggestion) => (
                <motion.div 
                  key={suggestion.id}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 w-40 aspect-square bg-gradient-to-br from-brand to-brand-light p-5 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden shadow-lg shadow-brand/20 group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                    <Plus className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-black text-white leading-tight mb-1">{suggestion.title}</p>
                    <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider line-clamp-1">{suggestion.description || 'Pode interessar'}</p>
                  </div>

                  <button 
                    onClick={() => {
                      // Custom prompt to process the suggestion
                      // For now, it just adds the item blindly or triggers the chat
                      // Best way: handleAddItem if it's simple or sendMessage
                      handleAddItem({
                        name: suggestion.title,
                        category: 'others'
                      });
                    }}
                    className="absolute inset-0 z-10 opacity-0"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

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

      {/* Bloco de sugestões removido para dar lugar ao novo Para Você acima */}

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-tight">Mercados Próximos</h4>
              <p className="text-[10px] text-neutral-400 font-medium italic">Encontre o melhor lugar para suas compras.</p>
            </div>
          </div>
          <button 
            onClick={handleFindMarkets}
            disabled={isLocating}
            className="p-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-brand hover:bg-brand/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLocating ? <Search className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          </button>
        </div>

        {locationError && (
          <p className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
            {locationError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {nearbyMarkets.slice(0, 3).map((market, i) => (
              <motion.div 
                key={market.placeId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 flex items-center justify-between group hover:border-brand/30 transition-all shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-neutral-800 dark:text-white truncate">{market.name}</p>
                  <p className="text-[9px] text-neutral-400 truncate tracking-tight">{market.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {market.rating && (
                      <div className="flex items-center gap-0.5 text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {market.rating}
                      </div>
                    )}
                    <span className="text-[8px] text-neutral-300 font-black uppercase tracking-widest">• 2km de distância</span>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(market.name + ' ' + market.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 text-neutral-400 hover:text-brand hover:border-brand/30 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
          {nearbyMarkets.length === 0 && !isLocating && !locationError && (
            <div className="text-center py-6 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2rem]">
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest leading-loose">
                Toque no ícone acima para<br/>encontrar locais próximos
              </p>
            </div>
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
