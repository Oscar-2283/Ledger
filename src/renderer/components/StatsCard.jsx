import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function StatsCard({ title, amount, type }) {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-6 h-6" />;
      case 'expense':
        return <TrendingDown className="w-6 h-6" />;
      case 'balance':
        return <Wallet className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getColor = () => {
    if (type === 'balance') {
      return amount >= 0 ? 'text-emerald-400' : 'text-red-400';
    }
    switch (type) {
      case 'income':
        return 'text-emerald-400';
      case 'expense':
        return 'text-red-400';
      default:
        return 'text-primary';
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'income':
        return 'from-emerald-500/20';
      case 'expense':
        return 'from-red-500/20';
      case 'balance':
        return amount >= 0 ? 'from-emerald-500/20' : 'from-red-500/20';
      default:
        return 'from-accent/20';
    }
  };

  return (
    <div
      className="glass-card card-shadow p-6 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 group"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getAccentColor()} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-secondary tracking-wide uppercase">
            {title}
          </span>
          <div className={`${getColor()} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
            {getIcon()}
          </div>
        </div>

        <div className={`text-4xl font-semibold ${getColor()} tracking-tight`}>
          ${amount.toLocaleString('zh-TW')}
        </div>
      </div>
    </div>
  );
}
