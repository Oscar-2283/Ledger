import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import MonthSelector from './components/MonthSelector';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import StatsCard from './components/StatsCard';
import TransactionModal from './components/TransactionModal';
import * as XLSX from 'xlsx';

function AppContent() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedTransactions, setCopiedTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'vendor', 'amount'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  const loadTransactions = async () => {
    try {
      const data = await window.electronAPI.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // 切換月份時清空選取
  useEffect(() => {
    setSelectedTransactions([]);
  }, [currentMonth]);

  const handleAddTransaction = async (transaction) => {
    try {
      await window.electronAPI.addTransaction(transaction);
      await loadTransactions();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id, transaction) => {
    try {
      await window.electronAPI.updateTransaction(id, transaction);
      await loadTransactions();
      setEditingTransaction(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await window.electronAPI.deleteTransaction(id);
      await loadTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleBatchDelete = async (ids) => {
    if (ids.length === 0) {
      alert('請先選擇要刪除的記錄');
      return;
    }

    if (!window.confirm(`確定要刪除選取的 ${ids.length} 筆記錄嗎？此操作無法復原。`)) {
      return;
    }

    try {
      for (const id of ids) {
        await window.electronAPI.deleteTransaction(id);
      }
      await loadTransactions();
      setSelectedTransactions([]);
      alert(`成功刪除 ${ids.length} 筆記錄`);
    } catch (error) {
      console.error('Failed to batch delete transactions:', error);
      alert('批量刪除失敗：' + error.message);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const handleCopyTransactions = (transactionIds) => {
    const toCopy = transactions.filter(t => transactionIds.includes(t.id));
    setCopiedTransactions(toCopy);
    alert(`已複製 ${toCopy.length} 筆記錄`);
  };

  const handlePasteTransactions = async (targetMonth) => {
    if (copiedTransactions.length === 0) {
      alert('沒有已複製的記錄');
      return;
    }

    try {
      const count = copiedTransactions.length;
      for (const transaction of copiedTransactions) {
        const day = transaction.date.split('-')[2];
        const newDate = `${targetMonth}-${day}`;

        await window.electronAPI.addTransaction({
          date: newDate,
          vendor: transaction.vendor,
          amount: transaction.amount,
          code: transaction.code,
          type: transaction.type,
        });
      }

      await loadTransactions();
      setCurrentMonth(targetMonth);
      setCopiedTransactions([]); // 清除複製的記錄
      alert(`成功貼上 ${count} 筆記錄到 ${targetMonth}`);
    } catch (error) {
      console.error('Failed to paste transactions:', error);
      alert('貼上失敗：' + error.message);
    }
  };

  const handleClearCopied = () => {
    setCopiedTransactions([]);
  };

  const handleExportToExcel = () => {
    const dataToExport = currentMonthTransactions.map(t => ({
      '日期': t.date,
      '廠商': t.vendor,
      '金額': t.amount,
      '代碼': t.code || '',
      '類型': t.type === 'income' ? '收入' : '支出'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, currentMonth);
    XLSX.writeFile(wb, `交易記錄_${currentMonth}.xlsx`);
  };

  const handleImportFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let importCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
          try {
            const transaction = {
              date: row['日期'] || row['Date'] || '',
              vendor: row['廠商'] || row['Vendor'] || '',
              amount: parseInt(row['金額'] || row['Amount'] || 0),
              code: (row['代碼'] || row['Code'] || '').toString(),
              type: (row['類型'] || row['Type']) === '收入' || (row['類型'] || row['Type']) === 'income' ? 'income' : 'expense'
            };

            if (transaction.date && transaction.vendor && transaction.amount) {
              await window.electronAPI.addTransaction(transaction);
              importCount++;
            } else {
              errorCount++;
            }
          } catch (err) {
            console.error('Error importing row:', err);
            errorCount++;
          }
        }

        await loadTransactions();
        alert(`匯入完成！\n成功：${importCount} 筆\n失敗：${errorCount} 筆`);
      } catch (error) {
        console.error('Failed to import Excel:', error);
        alert('匯入失敗：' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  // Calculate all available months
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      months.add(month);
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Calculate monthly stats for all months
  const monthlyStats = useMemo(() => {
    const stats = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!stats[month]) {
        stats[month] = { income: 0, expense: 0, count: 0 };
      }
      stats[month].count++;
      if (t.type === 'income') {
        stats[month].income += t.amount;
      } else {
        stats[month].expense += t.amount;
      }
    });
    return stats;
  }, [transactions]);

  // Filter transactions for current month
  const currentMonthTransactions = useMemo(() => {
    let filtered = transactions.filter(t => t.date.substring(0, 7) === currentMonth);

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'vendor':
          comparison = a.vendor.localeCompare(b.vendor);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, currentMonth, searchTerm, sortBy, sortOrder, filterType]);

  // Calculate total stats (all time)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-16 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-semibold tracking-tight mb-4 text-gradient">
              記帳工具
            </h1>
            <p className="text-lg text-secondary">
              精準記錄每一筆收支，掌握財務狀況
            </p>
          </div>

          {/* Total Stats Cards */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-sm font-medium text-secondary tracking-widest uppercase">
                所有時間總計
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="總收入"
                amount={totalIncome}
                type="income"
              />
              <StatsCard
                title="總支出"
                amount={totalExpense}
                type="expense"
              />
              <StatsCard
                title="總餘額"
                amount={totalBalance}
                type="balance"
              />
            </div>
          </div>

          {/* Spacer for fixed month selector */}
          <div className="h-20 mb-8"></div>

          {/* Transaction Form */}
          <div className="mb-8">
            <TransactionForm
              onSubmit={handleAddTransaction}
              defaultMonth={currentMonth}
            />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={currentMonthTransactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
            onBatchDelete={handleBatchDelete}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={setSortBy}
            onSortOrderChange={setSortOrder}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            selectedTransactions={selectedTransactions}
            onSelectionChange={setSelectedTransactions}
            onCopyTransactions={handleCopyTransactions}
            onExportToExcel={handleExportToExcel}
            onImportFromExcel={handleImportFromExcel}
          />
        </div>
      </div>

      {/* Fixed Month Selector */}
      <MonthSelector
        currentMonth={currentMonth}
        availableMonths={availableMonths}
        onMonthChange={setCurrentMonth}
        onPasteTransactions={handlePasteTransactions}
        onClearCopied={handleClearCopied}
        monthlyStats={monthlyStats}
        copiedCount={copiedTransactions.length}
      />

      {/* Edit Transaction Modal */}
      {showEditModal && editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleCloseModal}
          onSave={handleUpdateTransaction}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
