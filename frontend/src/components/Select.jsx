const Select = ({
  label,
  error,
  options = [],
  className = '',
  id,
  required = false,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-4 py-3
          bg-surface text-white
          border border-surface rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-300 ease-in-out
          ${error ? 'border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-surface text-text-secondary">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-surface text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Select;
