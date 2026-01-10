import { useRef } from 'react';
import { Calendar } from 'lucide-react';

export default function DateInput({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  ...props
}) {
  const dateInputRef = useRef(null);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={dateInputRef}
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`glass-input w-full [&::-webkit-calendar-picker-indicator]:hidden ${className}`}
          {...props}
        />
        <Calendar
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary cursor-pointer hover:text-primary transition-colors"
          onClick={() => dateInputRef.current?.showPicker()}
        />
      </div>
    </div>
  );
}
