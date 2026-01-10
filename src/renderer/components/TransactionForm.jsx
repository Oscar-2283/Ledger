import { useState } from 'react';
import { Plus } from 'lucide-react';
import DateInput from './ui/DateInput';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

const TYPE_OPTIONS = [
  { value: 'income', label: '收入' },
  { value: 'expense', label: '支出' },
];

export default function TransactionForm({ onSubmit, defaultMonth }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    amount: '',
    code: '',
    type: 'expense',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transaction = {
      ...formData,
      amount: parseInt(formData.amount, 10),
    };

    onSubmit(transaction);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      amount: '',
      code: '',
      type: 'expense',
    });
  };

  return (
    <div className="glass-card card-shadow p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gradient mb-1">新增記錄</h2>
        <p className="text-sm text-secondary">記錄新的收入或支出</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <DateInput
            label="日期"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="廠商名稱"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            placeholder="請輸入廠商名稱"
          />

          <Input
            label="金額"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="1"
            min="0"
            placeholder="0"
          />

          <Input
            label="代碼"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="支票號等"
          />

          <Select
            label="類型"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            options={TYPE_OPTIONS}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" icon={Plus}>
            新增記錄
          </Button>
        </div>
      </form>
    </div>
  );
}
