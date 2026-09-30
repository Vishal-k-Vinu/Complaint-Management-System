export default function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    error,
    autoComplete,
}) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-neutral-800"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                className={`
          w-full
          border
          bg-neutral-50
          px-4
          py-3
          text-sm
          text-neutral-950
          outline-none
          transition
          placeholder:text-neutral-400
          focus:bg-white
          ${error
                        ? "border-red-400 focus:border-red-600"
                        : "border-neutral-300 focus:border-neutral-950"
                    }
        `}
            />

            {error && (
                <p className="text-xs text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}