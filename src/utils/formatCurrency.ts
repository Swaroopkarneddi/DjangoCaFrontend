
/**
 * Format a number as Indian Rupees (INR)
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol
 */
export const formatCurrency = (amount: number): string => {
  // Use the Indian numbering system (thousands, lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};
