// Currency formatting utilities for Indonesian Rupiah display format

/**
 * Format a numeric value with thousand separators (dots)
 * Example: "1200000" -> "1.200.000"
 * @param {string|number} value - The numeric value to format
 * @returns {string} Formatted string with dots as thousand separators
 */
export const formatCurrency = (value) => {
    if (!value) return '';

    // Convert to string and remove any non-digit characters
    const numericValue = value.toString().replace(/\D/g, '');

    // If empty after cleanup, return empty string
    if (!numericValue) return '';

    // Add thousand separators (dots) using regex
    // This matches positions between digits where there are groups of 3 digits following
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Remove formatting to get raw numeric value
 * Example: "1.200.000" -> "1200000"
 * @param {string} formattedValue - The formatted value with dots
 * @returns {string} Raw numeric string without formatting
 */
export const parseCurrency = (formattedValue) => {
    if (!formattedValue) return '';

    // Remove all dots (thousand separators)
    return formattedValue.replace(/\./g, '');
};
