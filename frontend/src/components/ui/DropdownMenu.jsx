import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

export const DropdownMenu = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Usar el estado externo si se proporciona, sino usar el interno
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick
    });
  }

  return (
    <div {...props} onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ 
  children, 
  align = "start", 
  isOpen, 
  setIsOpen,
  className = "",
  ...props 
}) => {
  const alignClass = align === "end" ? "right-0" : "left-0";
  
  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        `absolute ${alignClass} mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-200 z-50`,
        className
      )}
      {...props}
    >
      <div className="py-1">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { setIsOpen });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  onSelect,
  disabled, 
  className = "",
  setIsOpen 
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    
    // Ejecutar la acción
    if (onClick) onClick(e);
    if (onSelect) onSelect();
    
    // Cerrar el dropdown
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};