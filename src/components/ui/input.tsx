import { InputHTMLAttributes } from "react";

export function Input(props:InputHTMLAttributes<HTMLInputElement>){
  return(
    <input
      {...props}
      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  );
}