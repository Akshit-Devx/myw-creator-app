import {useState, useEffect, useCallback} from 'react';

// Custom hook for debounced username validation
const useUsernameValidator = (getUserBySlug, debounceDelay = 500) => {
  const [validationState, setValidationState] = useState({
    isValidating: false,
    isValid: null,
    error: null,
  });

  const validateUsername = useCallback(
    async username => {
      if (!username || username.trim() === '') {
        setValidationState({
          isValidating: false,
          isValid: null,
          error: null,
        });
        return;
      }

      setValidationState(prev => ({
        ...prev,
        isValidating: true,
        error: null,
      }));

      try {
        const result = await getUserBySlug(username.trim());
        const isAvailable = !result || !result.id;

        setValidationState({
          isValidating: false,
          isValid: isAvailable,
          error: isAvailable ? null : 'Username is already taken',
        });
      } catch (error) {
        setValidationState({
          isValidating: false,
          isValid: false,
          error: 'Error checking username availability',
        });
      }
    },
    [getUserBySlug],
  );

  const debouncedValidate = useCallback(
    username => {
      const timeoutId = setTimeout(() => {
        validateUsername(username);
      }, debounceDelay);

      return () => clearTimeout(timeoutId);
    },
    [validateUsername, debounceDelay],
  );

  return {
    ...validationState,
    validateUsername: debouncedValidate,
  };
};

export default useUsernameValidator;
