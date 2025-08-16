'use client'
import React, { ReactNode } from "react";

interface InputProps {
    variant: "primary" | "secondary",
    className?: string,
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void,
    name: string,
    size: "md" | "lg",
    value: string,
    type: string,
    id: string
}

export const Input = ({variant, className, size, onChange, value, name, type, id} : InputProps) => {
    const variantClasses: {
        primary: string,
        secondary: string
    } = {
        primary: `block bg-gray-300 rounded-lg border-gray-800 border-1 ${size == "md" ? "py-1 px-2" : "py-3 px-4"} text-gray-800 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500`,
        secondary: "block bg-gray-300 rounded-lg border-gray-800 border-1 bg-gray-50 py-3 px-4 text-gray-800 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400",
    };


    let variantCls;
    if(variant == 'secondary'){
        variantCls = variantClasses.secondary;
    }else{
        variantCls = variantClasses.primary;
    }

    return <input
    className={`${className}  ${variantCls}`}
    onChange={onChange}
    value={value}
    id={id}
    name={name}
    type={type}
    />
}