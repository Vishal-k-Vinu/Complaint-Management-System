export default function Button({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    disabled = false,
    onClick,
    className = "",
}) {
    const variants = {
        primary:
            "bg-neutral-950 text-white hover:bg-neutral-800",

        secondary:
            "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",

        danger:
            "bg-red-700 text-white hover:bg-red-800",

        ghost:
            "text-neutral-700 hover:bg-neutral-100",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4
        py-3
        text-sm
        font-medium
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
        >
            {loading ? "Processing..." : children}
        </button>
    );
}