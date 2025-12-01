const Card = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-lg p-6
        transition-all duration-300 ease-in-out
        ${hoverable ? 'hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
