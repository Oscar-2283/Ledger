import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Modal({
  isOpen = true,
  onClose,
  title,
  description,
  children,
  className = '',
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm transition-colors duration-300"
      style={{
        backgroundColor: isDark
          ? 'rgba(0, 0, 0, 0.7)'
          : 'rgba(226, 223, 223, 0.2)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className={`glass-card card-shadow w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Header */}
        {(title || onClose) && (
          <div
            className="sticky top-0 backdrop-blur-xl px-8 py-6 transition-colors duration-300"
            style={{
              backgroundColor: isDark
                ? 'rgba(19, 19, 26, 0.95)'
                : 'rgba(255, 255, 255, 1)',
              borderBottom: `1px solid ${
                isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'
              }`,
            }}
          >
            <div className="flex items-center justify-between">
              {(title || description) && (
                <div>
                  {title && (
                    <h2 className="text-2xl font-semibold text-gradient mb-1">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-secondary">{description}</p>
                  )}
                </div>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-surface-01 hover:bg-surface-03 text-secondary hover:text-primary transition-all duration-200"
                  title="關閉"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
