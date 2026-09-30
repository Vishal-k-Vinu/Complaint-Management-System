const statusConfig = {
    PENDING: {
        label: "Pending",
        className:
            "bg-amber-50 text-amber-800 border-amber-200",
    },

    IN_PROGRESS: {
        label: "In progress",
        className:
            "bg-blue-50 text-blue-800 border-blue-200",
    },

    RESOLVED: {
        label: "Resolved",
        className:
            "bg-green-50 text-green-800 border-green-200",
    },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || {
        label: status,
        className:
            "bg-neutral-50 text-neutral-700 border-neutral-200",
    };

    return (
        <span
            className={`
        inline-flex
        items-center
        border
        px-2.5
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
        >
            {config.label}
        </span>
    );
}