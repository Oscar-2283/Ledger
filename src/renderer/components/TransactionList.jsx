import { useState } from 'react';
import {
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpDown,
  Filter,
  Copy,
  Upload,
  Download,
  Trash,
} from 'lucide-react';

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
  isSelected,
  onToggleSelect,
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDelete = () => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      onDelete(transaction.id);
    }
  };

  return (
    <div
      className="relative glass-card p-5 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mouse tracking spotlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(94, 106, 210, 0.15), transparent)`,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div className="relative flex items-center gap-6">
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(transaction.id)}
            className="w-5 h-5 rounded bg-surface-01 border-white/[0.2] text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
          />
        </div>

        {/* Type Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            transaction.type === 'income'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {transaction.type === 'income' ? (
            <TrendingUp className="w-6 h-6" />
          ) : (
            <TrendingDown className="w-6 h-6" />
          )}
        </div>

        {/* Date */}
        <div className="flex-shrink-0 w-28">
          <div className="text-xs text-secondary mb-1">日期</div>
          <div className="text-sm font-medium text-primary">
            {transaction.date}
          </div>
        </div>

        {/* Vendor */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-secondary mb-1">廠商名稱</div>
          <div className="text-sm font-medium text-primary truncate">
            {transaction.vendor}
          </div>
        </div>

        {/* Code */}
        <div className="flex-shrink-0 w-32">
          <div className="text-xs text-secondary mb-1">代碼</div>
          <div className="text-sm font-medium text-primary">
            {transaction.code || '-'}
          </div>
        </div>

        {/* Amount */}
        <div className="flex-shrink-0 w-40 text-right">
          <div className="text-xs text-secondary mb-1">金額</div>
          <div
            className={`text-xl font-semibold ${
              transaction.type === 'income'
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}$
            {transaction.amount.toLocaleString('zh-TW')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 rounded-lg bg-surface-01 hover:bg-surface-03 text-accent hover:text-accent-bright transition-all duration-200"
            title="編輯"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-surface-01 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-200"
            title="刪除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  onBatchDelete,
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  filterType,
  onFilterTypeChange,
  selectedTransactions = [],
  onSelectionChange,
  onCopyTransactions,
  onExportToExcel,
  onImportFromExcel,
}) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleSelect = (id) => {
    if (selectedTransactions.includes(id)) {
      onSelectionChange(selectedTransactions.filter((tid) => tid !== id));
    } else {
      onSelectionChange([...selectedTransactions, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(transactions.map((t) => t.id));
    }
  };

  const handleCopy = () => {
    if (selectedTransactions.length === 0) {
      alert('請先選擇要複製的記錄');
      return;
    }
    onCopyTransactions(selectedTransactions);
    onSelectionChange([]);
  };

  const handleBatchDelete = () => {
    if (selectedTransactions.length === 0) {
      alert('請先選擇要刪除的記錄');
      return;
    }
    onBatchDelete(selectedTransactions);
  };

  return (
    <div className="glass-card card-shadow p-8">
      {/* Header with filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gradient mb-1">
              交易記錄
            </h2>
            <p className="text-sm text-secondary">
              共 {transactions.length} 筆記錄
              {selectedTransactions.length > 0 &&
                ` (已選擇 ${selectedTransactions.length} 筆)`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {selectedTransactions.length > 0 && (
              <>
                <button
                  onClick={handleCopy}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  複製選取
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="btn-danger flex items-center gap-2 text-sm"
                >
                  <Trash className="w-4 h-4" />
                  刪除選取
                </button>
              </>
            )}

            <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              匯入 Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={onImportFromExcel}
                className="hidden"
              />
            </label>

            <button
              onClick={onExportToExcel}
              disabled={transactions.length === 0}
              className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              匯出 Excel
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Select All */}
          <div className="flex items-center gap-3 px-3 py-2 glass-input">
            <input
              type="checkbox"
              checked={
                transactions.length > 0 &&
                selectedTransactions.length === transactions.length
              }
              onChange={handleSelectAll}
              className="w-4 h-4 rounded bg-surface-01 border-white/[0.2] text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-primary">全選</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="搜尋廠商或代碼..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="glass-input w-full !pl-12"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="glass-input flex-1"
            >
              <option value="date">按日期排序</option>
              <option value="vendor">按廠商排序</option>
              <option value="amount">按金額排序</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-2.5 rounded-lg bg-surface-01 hover:bg-surface-03 text-primary transition-all duration-200"
              title={sortOrder === 'asc' ? '升序' : '降序'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <select
              value={filterType}
              onChange={(e) => onFilterTypeChange(e.target.value)}
              className="glass-input flex-1"
            >
              <option value="all">全部類型</option>
              <option value="income">僅收入</option>
              <option value="expense">僅支出</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-01 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-gradient mb-2">
            {searchTerm || filterType !== 'all'
              ? '找不到符合條件的記錄'
              : '本月尚無記帳記錄'}
          </h3>
          <p className="text-secondary">
            {searchTerm || filterType !== 'all'
              ? '請調整搜尋或篩選條件'
              : '開始記錄您的第一筆交易'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              isSelected={selectedTransactions.includes(transaction.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
