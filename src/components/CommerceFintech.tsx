/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  ArrowRight, 
  Truck, 
  Cpu, 
  Database,
  Smartphone,
  Plus,
  Bookmark,
  Share2,
  Lock,
  Activity,
  CheckCircle,
  Users
} from 'lucide-react';
import { InventoryProduct, LedgerEntry, MicroLoanProposal } from '../types';

interface CommerceFintechProps {
  products: InventoryProduct[];
  ledger: LedgerEntry[];
  loans: MicroLoanProposal[];
  onPurchaseProduct: (productId: string, price: number) => void;
  onAddTransaction: (desc: string, amount: number, type: 'earn' | 'spend' | 'transfer' | 'reward', isOffline: boolean) => void;
  onUpdateLoanFunding: (loanId: string, amountAdded: number) => void;
  walletBalance: number;
  networkStatus: string;
}

export default function CommerceFintech({
  products,
  ledger,
  loans,
  onPurchaseProduct,
  onAddTransaction,
  onUpdateLoanFunding,
  walletBalance,
  networkStatus
}: CommerceFintechProps) {
  const [activeSubTab, setActiveSubTab] = useState<'commerce' | 'skypay'>('commerce');
  
  // Local Commerce Engine states
  const [inventory, setInventory] = useState<InventoryProduct[]>(products);
  const [successPurchaseMsg, setSuccessPurchaseMsg] = useState<string>('');
  
  // Custom Product Creation Form States
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('Agricultural Crops');

  // SkyPay Wallet States
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferResult, setTransferResult] = useState('');
  const [isPassiveGenerating, setIsPassiveGenerating] = useState(true);
  const [passiveEarnings, setPassiveEarnings] = useState(0);
  const [walletFeedback, setWalletFeedback] = useState<string>('');

  // Micro savings inputs
  const [savingsDeposit, setSavingsDeposit] = useState('');
  const [savingsPoolBalance, setSavingsPoolBalance] = useState(45); // Starter cooperative savings pool

  useEffect(() => {
    let interval: any;
    if (isPassiveGenerating && networkStatus !== 'offline') {
      interval = setInterval(() => {
        // Increment small fractional passive dividend for hosting solar mesh relays
        setPassiveEarnings(p => {
          const next = Number((p + 0.05).toFixed(2));
          if (next >= 1.0) {
            onAddTransaction('Passive Relay Uptime Share dividend payout', 1, 'earn', false);
            return 0;
          }
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPassiveGenerating, networkStatus]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;

    const newProd: InventoryProduct = {
      id: `prod-${Date.now()}`,
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      unit: 'unit',
      stock: Number(prodStock),
      description: prodDesc || 'Local craft catalog item optimized for decentralized community distribution.',
      vendor: 'Community Cooperative Hub',
      demandForecast: 'Moderate. Local seasonal trends suggest balanced sales over high-sun periods.'
    };

    setInventory(prev => [newProd, ...prev]);
    setProdName('');
    setProdPrice('');
    setProdStock('');
    setProdDesc('');
    setShowProductForm(false);
  };

  const executePurchase = (prod: InventoryProduct) => {
    if (walletBalance < prod.price) {
      setSuccessPurchaseMsg('Error: Insufficient connection credit balance inside SkyPay Wallet.');
      setTimeout(() => setSuccessPurchaseMsg(''), 4000);
      return;
    }

    if (prod.stock <= 0) {
      setSuccessPurchaseMsg(`Error: ${prod.name} has run completely out of warehouse inventory.`);
      setTimeout(() => setSuccessPurchaseMsg(''), 4000);
      return;
    }

    onPurchaseProduct(prod.id, prod.price);
    // Deduct stock locally
    setInventory(prev => prev.map(p => p.id === prod.id ? { ...p, stock: p.stock - 1 } : p));
    setSuccessPurchaseMsg(`Success! Purchased ${prod.name} for ${prod.price} credits. local delivery runner dispatched.`);
    setTimeout(() => setSuccessPurchaseMsg(''), 4000);
  };

  const handlePledgeFunding = (loanId: string, textAmount: string) => {
    const pledge = Number(textAmount);
    if (!pledge || pledge <= 0) return;

    if (walletBalance < pledge) {
      setWalletFeedback('Error: Insufficient cooperative credits in your wallet for microfinance pledge.');
      setTimeout(() => setWalletFeedback(''), 4000);
      return;
    }

    onUpdateLoanFunding(loanId, pledge);
    // Trigger ledger deduction
    onAddTransaction(
      `Backed Loan Cooperative ID: #${loanId.slice(-4)}`,
      -pledge,
      'transfer',
      networkStatus === 'offline'
    );
    setWalletFeedback(`Success! Funded ${pledge} credits to loan #${loanId.slice(-4).toUpperCase()}.`);
    setTimeout(() => setWalletFeedback(''), 4000);
  };

  const executeP2PTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Number(transferAmount);
    if (!sum || sum <= 0 || !transferRecipient) return;

    if (walletBalance < sum) {
      setTransferResult('Error: Credit threshold exceeded.');
      return;
    }

    onAddTransaction(
      `P2P transfer to peer address (${transferRecipient.slice(0, 10)}...)`,
      -sum,
      'transfer',
      networkStatus === 'offline'
    );

    setTransferResult(`Successfully locked ${sum} credits to transmit via Bluetooth mesh.`);
    setTransferAmount('');
    setTransferRecipient('');
    setTimeout(() => setTransferResult(''), 4000);
  };

  const handleDepositSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Number(savingsDeposit);
    if (!sum || sum <= 0) return;

    if (walletBalance < sum) {
      setWalletFeedback('Error: Insufficient cooperative wallet credits for Susu pool deposit.');
      setTimeout(() => setWalletFeedback(''), 4000);
      return;
    }

    onAddTransaction(
      'Cooperative micro-savings ring deposit',
      -sum,
      'spend',
      networkStatus === 'offline'
    );
    setSavingsPoolBalance(prev => prev + sum);
    setSavingsDeposit('');
    setWalletFeedback(`Success! Deposited ${sum} credits into local Susu Cooperative Pool.`);
    setTimeout(() => setWalletFeedback(''), 4000);
  };

  return (
    <div className="space-y-6" id="commerce-fintech-module">
      
      {/* Sub tabs configuration */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setActiveSubTab('commerce')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'commerce' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-comm"
        >
          Local Trade & Commerce listings
        </button>
        <button
          onClick={() => setActiveSubTab('skypay')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'skypay' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-skypay"
        >
          SkyPay Financial Wallet & Co-ops
        </button>
      </div>

      {activeSubTab === 'commerce' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="trade-engine-view">
          
          {/* Marketplace Listing Details & Inventory catalog */}
          <div className="lg:col-span-2 space-y-6">
            {successPurchaseMsg && (
              <div className={`p-4 rounded-xl border text-xs font-semibold ${
                successPurchaseMsg.startsWith('Error') 
                  ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-805 dark:bg-emerald-950/20 dark:border-emerald-900/30'
              }`}>
                {successPurchaseMsg}
              </div>
            )}

            {showProductForm && (
              <form onSubmit={handleCreateProduct} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md space-y-4" id="form-create-product">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Register Cooperative Crop / Produce</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Product Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Organic Millet Flour"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      id="input-prod-name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Product category</label>
                    <select 
                      value={prodCategory} 
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full text-xs px-3 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Agricultural Crops">Agricultural Crops & Grain</option>
                      <option value="Natural Produce">Natural Produce & Honey</option>
                      <option value="Infrastructure Accessories">Infrastructure solar</option>
                      <option value="Local Craft Textiles">Local Wearable Fabrics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Pricing (Credits)</label>
                    <input 
                      type="number" 
                      required 
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      id="input-prod-price"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Available Stock (Units)</label>
                    <input 
                      type="number" 
                      required 
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      id="input-prod-stock"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Description</label>
                  <textarea 
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    rows={2}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="textarea-prod-desc"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowProductForm(false)}
                    className="text-xs px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    id="btn-confirm-publish-product"
                  >
                    Confirm Register Product
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventory.map(prod => (
                <div key={prod.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider font-mono">{prod.category}</span>
                        <h4 className="text-sm font-semibold text-zinc-950 dark:text-white leading-snug mt-0.5">{prod.name}</h4>
                      </div>
                      <span className="text-xs font-bold font-sans text-emerald-600 bg-emerald-50 dark:bg-zinc-800 dark:text-emerald-400 px-2 py-1 rounded-sm">
                        {prod.price} Credits
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{prod.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-400">
                      <span>Stock: <strong className="text-zinc-800 dark:text-zinc-250 font-mono">{prod.stock} units</strong></span>
                      <span className="text-right">Vendor: {prod.vendor}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center mt-4">
                    <span className="text-[9px] text-zinc-400 font-mono">By cooperative request</span>
                    <button
                      onClick={() => executePurchase(prod)}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold rounded-lg transition-all"
                      id={`btn-buy-product-${prod.id}`}
                    >
                      Exchange Seeds
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Demand Forecasting and delivery runners metrics */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-fit space-y-4">
              <div className="flex items-center gap-1.5">
                <Cpu className="text-indigo-500 w-4 h-4 animate-pulse" />
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-widest font-mono">AI Demand Forecast</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Our decentralized AI models predict pricing and cooperative warehouse priorities under climate changes.</p>
              
              <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">High-Yield Teff Grain Bags</span>
                  <span className="text-emerald-500 font-bold font-mono">↑ 15% Crop Deficit</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">Forecast: Agricultural logistics bottleneck expected on month-end rain forecasts. Advise cooperative members to hold back 5 units for local storage buffers.</p>
              </div>

              <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Lithium Power mods</span>
                  <span className="text-amber-500 font-bold font-mono">↓ 8% Stable Demand</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">Forecast: Rapid onset of low-solar seasonal conditions requires immediate grid battery upgrades. Direct shipping prioritizations.</p>
              </div>

              <button 
                onClick={() => setShowProductForm(true)}
                className="w-full text-xs font-semibold py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl"
                id="btn-trigger-product-form"
              >
                Register Product Stock
              </button>
            </div>

            {/* Local Courier tracking lists */}
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">Cooperative couriers log</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-zinc-400" /> Courier A. Diallo</span>
                  <span className="text-[10px] text-indigo-500 font-bold">Dispatched (Node 3)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-zinc-400" /> Courier L. Finch</span>
                  <span className="text-[10px] text-emerald-500 font-bold">Returned & Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4" id="skypay-finance-wrapper">
          {walletFeedback && (
            <div className={`p-4 rounded-xl border text-xs font-semibold ${
              walletFeedback.startsWith('Error') 
                ? 'bg-rose-50 border-rose-200 text-rose-850 dark:bg-rose-950/20 dark:border-rose-900/30' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-805 dark:bg-emerald-950/20 dark:border-emerald-900/30'
            }`}>
              {walletFeedback}
            </div>
          )}
          {transferResult && (
            <div className={`p-4 rounded-xl border text-xs font-semibold ${
              transferResult.startsWith('Error') 
                ? 'bg-rose-50 border-rose-200 text-rose-850 dark:bg-rose-950/20 dark:border-rose-900/30' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-805 dark:bg-emerald-950/20 dark:border-emerald-900/30'
            }`}>
              {transferResult}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="skypay-finance-view">
          
          {/* SkyPay Wallet Card mockup */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-3xl relative overflow-hidden shadow-sm border border-zinc-850 dark:border-zinc-200">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
              
              <div className="relative z-10 flex flex-col justify-between h-40">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest block opacity-75 font-mono">SkyPay Secured Identity</span>
                    <span className="text-xs font-semibold tracking-wide">co-op-member#9239.skypay</span>
                  </div>
                  <Smartphone className="w-5 h-5 text-zinc-400 dark:text-zinc-650" />
                </div>

                <div>
                  <span className="text-[10px] opacity-75 uppercase block tracking-wider font-mono">Available Connectivity Credits</span>
                  <span className="text-3xl font-sans font-bold text-white dark:text-zinc-900 tracking-tight">{walletBalance.toFixed(2)} <span className="text-sm font-semibold opacity-80">Credits</span></span>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 dark:border-zinc-200/50 pt-2 text-[10px] opacity-70">
                  <span className="font-mono">P2P Verification Code: ID-BL-ECC</span>
                  <span>Auto-Uptime Active</span>
                </div>
              </div>
            </div>

            {/* Passive dividends generator */}
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">Mesh Solar Revenue Sharing</span>
                <span className={`w-1.5 h-1.5 rounded-full ${networkStatus === 'offline' ? 'bg-zinc-400' : 'bg-emerald-500 animate-ping'}`} />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Claim fractional credit dividends dynamically as your hosting node facilitates short-range mesh routing.</p>
              
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Unclaimed dividends increment:</span>
                <span className="text-indigo-500 font-bold">+{passiveEarnings.toFixed(2)} Credits</span>
              </div>
            </div>

            {/* Savings Pool and cooperative lending panels */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Local Savings Ring (Susu Cooperative)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Pooled micro-deposits safe-guarding households during emergencies.</p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500">Cooperative Susu Pool</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{savingsPoolBalance} Credits</span>
              </div>

              <form onSubmit={handleDepositSavings} className="flex gap-2" id="form-savings">
                <input 
                  type="number" 
                  placeholder="Deposit amnt (e.g. 10)"
                  value={savingsDeposit}
                  onChange={(e) => setSavingsDeposit(e.target.value)}
                  className="grow text-xs px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  id="input-savings-deposit"
                />
                <button 
                  type="submit" 
                  className="text-xs font-semibold px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-lg"
                  id="btn-submit-savings"
                >
                  Deposit
                </button>
              </form>
            </div>
          </div>

          {/* Microfinance Cooperatives Peer Lending Deck */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Cooperative Peer Microfinance</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">Fund Community Producers</h3>
              <p className="text-xs text-zinc-400 mt-1">Lend cooperative credits to local creators. Repayments occur directly over monthly decentralized vouchers.</p>
            </div>

            <div className="space-y-4">
              {loans.map(loan => {
                const percent = Math.min(100, Math.round((loan.funded / loan.amount) * 100));
                
                return (
                  <div key={loan.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-zinc-400 block font-mono">Borrower: {loan.borrower}</span>
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">{loan.purpose}</h4>
                      </div>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        loan.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>Funded: {loan.funded} of {loan.amount} Credits</span>
                        <span className="font-mono">{percent}% Complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {loan.status === 'funding' && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="number"
                          placeholder="Amount (e.g. 10)"
                          id={`input-pledge-${loan.id}`}
                          className="grow text-[11px] px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        />
                        <button
                          onClick={() => {
                            const val = (document.getElementById(`input-pledge-${loan.id}`) as HTMLInputElement)?.value;
                            handlePledgeFunding(loan.id, val || '');
                            if (val) (document.getElementById(`input-pledge-${loan.id}`) as HTMLInputElement).value = '';
                          }}
                          className="text-[10px] font-semibold px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-md"
                          id={`btn-pledge-lend-${loan.id}`}
                        >
                          Pledge Credits
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick peer-to-peer transfer form & logs */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs h-fit space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">P2P Ledger Transfer</h3>
              <p className="text-xs text-zinc-400 mt-1">Wire credits via physical offline Bluetooth connection. Validates fully locally.</p>
            </div>

            {transferResult && (
              <p className="text-xs p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-mono">
                {transferResult}
              </p>
            )}

            <form onSubmit={executeP2PTransfer} className="space-y-4" id="form-transfer-ledger">
              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Recipient Peer code / Address</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. user#4819.skypay"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="input-transfer-recipient"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Pledging amount</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Quantity (e.g. 15)"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="input-transfer-amount"
                />
              </div>

              <button
                type="submit"
                className="w-full text-xs font-semibold py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl"
                id="btn-confirm-transfer"
              >
                Trigger Bluetooth Payout
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-2">Transaction History logs</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {ledger.map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-[10px] p-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg">
                    <div className="space-y-0.5 max-w-[70%]">
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate block">{log.description}</span>
                      <span className="text-zinc-400 text-[8px] font-mono">{log.timestamp}</span>
                    </div>
                    <span className={`font-mono font-bold font-sans ${log.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {log.amount > 0 ? `+${log.amount}` : log.amount} cr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}
