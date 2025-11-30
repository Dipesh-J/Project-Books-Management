const Textarea = ({
  label,
  error,
  className = '',
  id,
  required = false,
  rows = 4,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-surface text-white
          border border-surface rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          placeholder:text-text-secondary
          transition-all duration-300 ease-in-out
          resize-y
          ${error ? 'border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Textarea;
