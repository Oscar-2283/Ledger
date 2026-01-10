export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`glass-input w-full ${className}`}
        {...props}
      />
    </div>
  );
}
