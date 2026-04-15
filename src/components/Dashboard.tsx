import React from 'react';
import { ArrowUpRight, Activity, Wallet, DollarSign } from 'lucide-react';

const mockTransactions = [
  { id: 'tx-123', hash: 'fb7ae...', amount: '$1,200', asset: 'USDC', time: '2 mins ago', status: 'Completed' },
  { id: 'tx-124', hash: 'aa83x...', amount: '$450', asset: 'XLM', time: '15 mins ago', status: 'Completed' },
  { id: 'tx-125', hash: '9b2cs...', amount: '$3,100', asset: 'USDC', time: '1 hour ago', status: 'Completed' },
  { id: 'tx-126', hash: 'c9f81...', amount: '$250', asset: 'USDC', time: '2 hours ago', status: 'Completed' },
  { id: 'tx-127', hash: '4da10...', amount: '$5,000', asset: 'EURC', time: '5 hours ago', status: 'Processing' },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-[#b102cd]">
          Transparency Dashboard
        </h1>
        <p className="text-fundable-light-grey mt-2">
          Real-time metrics on fiat offramps processed via the Stellar network.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Volume (USD)', value: '$1.42M', icon: DollarSign, color: 'text-green-400' },
          { label: 'Total Transactions', value: '45,231', icon: Activity, color: 'text-blue-400' },
          { label: 'Active Wallets', value: '12,904', icon: Wallet, color: 'text-purple-400' },
          { label: '24h Volume', value: '$24.5K', icon: ArrowUpRight, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-fundable-mid-grey border border-border/20 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-[#b102cd]/50 transition-colors">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-fundable-deep-purple/20 rounded-full blur-2xl group-hover:bg-[#b102cd]/30 transition-all"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-fundable-light-grey text-sm font-medium tracking-wide">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <span className="text-4xl font-bold font-inter tracking-tight text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Live Transaction Feed Table */}
      <div className="bg-fundable-mid-dark border border-border/20 rounded-xl overflow-hidden mt-4 shadow-lg shadow-fundable-deep-purple/10">
        <div className="px-6 py-5 border-b border-border/20 flex justify-between items-center bg-[#101015]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Recent Offramps
          </h2>
          <a href="#" className="text-xs font-semibold text-fundable-purple-2 hover:text-[#b102cd] transition-colors flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10">
            View All On Explorer <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        
        <div className="overflow-x-auto distribution-scrollbar py-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/10">
                <th className="py-4 px-6 text-xs font-semibold text-fundable-light-grey uppercase tracking-widest pl-8">Transaction Hash</th>
                <th className="py-4 px-6 text-xs font-semibold text-fundable-light-grey uppercase tracking-widest">Asset</th>
                <th className="py-4 px-6 text-xs font-semibold text-fundable-light-grey uppercase tracking-widest">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-fundable-light-grey uppercase tracking-widest">Time</th>
                <th className="py-4 px-6 text-xs font-semibold text-fundable-light-grey uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-fundable-grey/20 transition-colors group">
                  <td className="py-4 px-6 text-sm text-fundable-purple-2 font-mono flex items-center gap-2 pl-8">
                    {tx.hash} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-fundable-faint-white">{tx.asset}</td>
                  <td className="py-4 px-6 text-sm tabular-nums text-white font-semibold">{tx.amount}</td>
                  <td className="py-4 px-6 text-sm text-fundable-light-grey">{tx.time}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium shadow-sm transition-colors ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-green-500/10' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-orange-500/10'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
