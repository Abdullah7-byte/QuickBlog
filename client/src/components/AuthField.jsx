const AuthField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  required = true,
  autoComplete,
  wrapperClassName = "mt-8",
  ...inputProps
}) => {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full mt-2 border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors"
        required={required}
        autoComplete={autoComplete}
        {...inputProps}
      />
    </div>
  );
};

export default AuthField;
