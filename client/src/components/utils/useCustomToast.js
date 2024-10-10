import { toast } from 'react-hot-toast';

const toastConfig = {
  duration: 2000,
  position: 'top-right',
};

const activeToasts = new Set();

export const useCustomToast = () => {
  const showToast = (message, type = 'default') => {
    if (activeToasts.has(message)) {
      return; // Don't show the toast if it's already active
    }

    const toastId = type === 'success' ? 
      toast.success(message, toastConfig) :
      type === 'error' ? 
        toast.error(message, toastConfig) :
        toast(message, toastConfig);

    activeToasts.add(message);

    // Remove the message from activeToasts when the toast is dismissed
    setTimeout(() => {
      activeToasts.delete(message);
    }, toastConfig.duration);

    return toastId;
  };

  return showToast;
};
