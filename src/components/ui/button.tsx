import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md";
}

export function Button({
  children,
  variant="default",
  size="md",
  className="",
  ...props
}:Props){

  const base="rounded-xl font-semibold transition";

  const variants={
    default:"bg-orange-500 hover:bg-orange-600 text-white",
    outline:"border border-white/30 hover:bg-white/10 text-white"
  };

  const sizes={
    sm:"px-3 py-1 text-sm",
    md:"px-5 py-2"
  };

  return(
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}