import React from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, className = '', ...props }) => {
  const baseClasses = "bg-[var(--color-primary)] text-[var(--on-primary)] px-3 py-2 rounded-sm cursor-pointer m-2 transition-all duration-150 font-sans";
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
