export default function Button({
  type = 'button',
  variant = 'primary',
  children,
  onClick,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} flex items-center gap-2 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
