"use client";

import React, { ReactNode } from "react";


interface buttonProps {
  variant: 'primary' | "secondary",
  className?: string,
  children?: ReactNode,
  onClick? : (e: React.MouseEvent) => void
}



export const Button = ({ variant = 'primary', className = '', children, onClick }: buttonProps) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 font-semibold text-base rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses: {
    primary: string,
    secondary: string
  } = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-400",
  };

  let variantCls
  if(variant == 'secondary'){
    variantCls = variantClasses.secondary;
  }else{
    variantCls = variantClasses.primary;
  }
  
  return (
    <button className={`${baseClasses} ${variantCls} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
