import { useState } from "react";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Simple toast implementation for demo purposes
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Toast) => {
    console.log(`Toast: ${newToast.title}${newToast.description ? ` - ${newToast.description}` : ''}`);
    setToasts(prev => [...prev, newToast]);
    
    // Show alert for now - in production use proper toast library
    alert(`${newToast.title}${newToast.description ? `\n${newToast.description}` : ''}`);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 5000);
  };

  return { toast, toasts };
}