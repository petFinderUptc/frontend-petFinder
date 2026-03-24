export const pushAppAlert = ({ type = 'info', message = '' }) => {
  if (!message || typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('petfinder:alert', {
      detail: { type, message },
    }),
  );
};
