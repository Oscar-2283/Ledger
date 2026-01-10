import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Clipboard, X } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function MonthSelector({
  currentMonth,
  availableMonths,
  onMonthChange,
  onPasteTransactions,
  onClearCopied,
  monthlyStats,
  copiedCount = 0
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showDropdown, setShowDropdown] = useState(false);

  // Parse current month (YYYY-MM format)
  const [year, month] = currentMonth.split('-').map(Number);

  // Month names in Chinese
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const newMonth = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const newMonth = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  // Get stats for a specific month
  const getMonthStats = (monthKey) => {
    return monthlyStats[monthKey] || { income: 0, expense: 0, count: 0 };
  };

  const currentStats = getMonthStats(currentMonth);

  const handlePaste = () => {
    if (copiedCount === 0) {
      alert('沒有已複製的記錄');
      return;
    }
    onPasteTransactions(currentMonth);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl transition-all duration-300" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 95%, transparent)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Navigation buttons */}
              <button
                onClick={goToPreviousMonth}
                className="p-2.5 rounded-lg bg-surface-01 hover:bg-surface-03 text-primary transition-all duration-200"
                title="上一月"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Month display and dropdown */}
            <div className="relative flex-1 max-w-md">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-01 hover:bg-surface-02 transition-all duration-200 group"
              >
                <Calendar className="w-5 h-5 text-accent" />
                <div className="flex-1 text-center">
                  <div className="text-xl font-semibold text-gradient">
                    {year} 年 {monthNames[month - 1]}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-secondary transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div
                    className="absolute top-full left-0 right-0 mt-2 card-shadow max-h-96 overflow-y-auto z-50 rounded-2xl border transition-colors duration-300"
                    style={{
                      backgroundColor: isDark ? '#13131A' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="p-2">
                      {availableMonths.length === 0 ? (
                        <div className="p-4 text-center text-secondary">
                          僅有當前月份
                        </div>
                      ) : (
                        availableMonths.map((monthKey) => {
                          const [y, m] = monthKey.split('-').map(Number);
                          const stats = getMonthStats(monthKey);
                          const isActive = monthKey === currentMonth;

                          return (
                            <button
                              key={monthKey}
                              onClick={() => {
                                onMonthChange(monthKey);
                                setShowDropdown(false);
                              }}
                              className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                                isActive
                                  ? 'bg-accent/20 border border-accent/30'
                                  : 'hover:bg-surface-01'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-base font-semibold text-primary">
                                    {y} 年 {monthNames[m - 1]}
                                  </div>
                                  <div className="text-xs text-secondary mt-0.5">
                                    {stats.count} 筆記錄
                                  </div>
                                </div>
                                <div className="text-right text-xs">
                                  <div className="text-emerald-400">
                                    收 ${stats.income.toLocaleString('zh-TW')}
                                  </div>
                                  <div className="text-red-400">
                                    支 ${stats.expense.toLocaleString('zh-TW')}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Stats Display */}
            <div className="hidden lg:flex items-center gap-6 px-4">
              <div className="text-center">
                <div className="text-xs text-secondary">收入</div>
                <div className="text-base font-semibold text-emerald-400">
                  ${currentStats.income.toLocaleString('zh-TW')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-secondary">支出</div>
                <div className="text-base font-semibold text-red-400">
                  ${currentStats.expense.toLocaleString('zh-TW')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-secondary">結餘</div>
                <div className={`text-base font-semibold ${
                  (currentStats.income - currentStats.expense) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  ${(currentStats.income - currentStats.expense).toLocaleString('zh-TW')}
                </div>
              </div>
            </div>

            {/* Paste and Clear buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePaste}
                disabled={copiedCount === 0}
                className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  copiedCount > 0
                    ? 'bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30'
                    : 'bg-surface-04 text-secondary cursor-not-allowed'
                }`}
                title={copiedCount > 0 ? `貼上 ${copiedCount} 筆記錄` : '沒有已複製的記錄'}
              >
                <Clipboard className="w-5 h-5" />
                {copiedCount > 0 && (
                  <span className="text-sm font-medium">{copiedCount}</span>
                )}
              </button>

              {copiedCount > 0 && (
                <button
                  onClick={onClearCopied}
                  className="p-2.5 rounded-lg bg-surface-01 hover:bg-red-500/20 text-secondary hover:text-red-400 transition-all duration-200"
                  title="清除複製的記錄"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Next month button */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToNextMonth}
                className="p-2.5 rounded-lg bg-surface-01 hover:bg-surface-03 text-primary transition-all duration-200"
                title="下一月"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
