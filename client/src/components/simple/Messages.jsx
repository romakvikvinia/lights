import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'rendition';

export const Messages = ({ message: PMessage, ...props }) => {
  const [{ show, message }, setState] = useState({
    show: !!PMessage,
    message: PMessage,
  });

  const handleDismiss = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      show: false,
      message: null,
    }));
  }, []);

  useEffect(() => {
    if (PMessage)
      setState((prevState) => ({
        ...prevState,
        show: true,
        message: PMessage,
      }));
  }, [PMessage]);
  return show ? (
    <Alert onDismiss={handleDismiss} {...props}>
      {message}
    </Alert>
  ) : null;
};
