import React from "react";

const Button = ({className, children, onClick, disabled, ariaLabel }) => {
    return (
        <button type="button" className={`inline-flex rounded-[4px] py-2 px-4 text-sm font-medium text-white ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-700/90"} ${className}`} onClick={disabled ? null : onClick} aria-label={ariaLabel}>
            {children}
        </button>
    );
}

export default Button;