import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md'
}) => {
  useEffect(() => {
    // Lock scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className={`${sizeClasses[size]} w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="mb-4 border-b pb-4">
              <h3 className="text-xl font-medium text-text-primary">{title}</h3>
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 