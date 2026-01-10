import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Modal from './ui/Modal';
import DateInput from './ui/DateInput';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

const TYPE_OPTIONS = [
  { value: 'income', label: '收入' },
  { value: 'expense', label: '支出' },
];

export default function TransactionModal({ transaction, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    vendor: transaction?.vendor || '',
    amount: transaction?.amount?.toString() || '',
    code: transaction?.code || '',
    type: transaction?.type || 'expense',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        vendor: transaction.vendor,
        amount: transaction.amount.toString(),
        code: transaction.code || '',
        type: transaction.type,
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTransaction = {
      ...formData,
      amount: parseInt(formData.amount, 10),
    };

    onSave(transaction.id, updatedTransaction);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="編輯交易記錄"
      description="修改這筆交易的詳細資訊"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Select
              label="類型"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              options={TYPE_OPTIONS}
            />
          </div>

          <Input
            label="代碼"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="支票號碼等（選填）"
          />
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save} className="flex-1">
            儲存變更
          </Button>
          <Button type="button" variant="danger" icon={X} onClick={onClose}>
            取消
          </Button>
        </div>
      </form>
    </Modal>
  );
}
