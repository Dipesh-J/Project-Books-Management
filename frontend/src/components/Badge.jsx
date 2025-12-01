const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface text-text-secondary',
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1
        text-xs font-medium rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
