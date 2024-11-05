import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#22C55E',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '✅',
    });
  },
  
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '❌',
    });
  },
  
  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#363636',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};