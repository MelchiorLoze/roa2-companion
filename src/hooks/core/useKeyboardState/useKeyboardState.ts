import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardState = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(Keyboard.isVisible());

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isKeyboardVisible } as const;
};
