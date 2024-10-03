import { useCallback } from 'react';

export const useCurrencyFormatter = () => {
  return useCallback((value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(numericValue).replace(/\D00(?=\D*$)/, '');
  }, []);
};
