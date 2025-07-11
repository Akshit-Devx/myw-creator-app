import {useEffect} from 'react';
import Toast from 'react-native-toast-message';

const ToastMessage = ({toastDisplay, toastMessage, toastType}) => {
  useEffect(() => {
    if (!toastDisplay || !toastMessage || !toastType) return;

    let type = toastType;
    if (toastType === 'warning') type = 'info'; // fallback since default doesn't support 'warning'

    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: toastMessage,
      position: 'top',
      visibilityTime: 3000,
    });
  }, [toastDisplay, toastMessage, toastType]);

  return null;
};

export default ToastMessage;
