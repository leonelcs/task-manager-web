/**
 * Date utility functions for consistent date handling across the application
 * Using European date format: dd-MM-yyyy
 */

// Date format constants - use these throughout the application
export const DATE_FORMAT = 'dd-MM-yyyy';
export const DATETIME_FORMAT = 'dd-MM-yyyy HH:mm';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

// HTML input format constants
export const HTML_DATE_INPUT_FORMAT = 'yyyy-MM-dd';
export const HTML_DATETIME_INPUT_FORMAT = 'yyyy-MM-ddTHH:mm';

/**
 * Format a date to European format (dd-MM-yyyy)
 */
export const formatDateEuropean = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Format a date to European datetime format (dd-MM-yyyy HH:mm)
 */
export const formatDateTimeEuropean = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Parse a European date string (dd-MM-yyyy or dd-MM-yyyy HH:mm) to Date object
 */
export const parseEuropeanDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Handle dd-MM-yyyy HH:mm format
  const dateTimeMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (dateTimeMatch) {
    const [, day, month, year, hours, minutes] = dateTimeMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  }
  
  // Handle dd-MM-yyyy format
  const dateMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  return null;
};

/**
 * Convert European date string to ISO format for API calls
 */
export const europeanToISODate = (dateString: string): string => {
  const date = parseEuropeanDate(dateString);
  if (!date) return '';
  
  return date.toISOString();
};

/**
 * Convert European date string to ISO date only (YYYY-MM-DD) for API calls
 */
export const europeanToISODateOnly = (dateString: string): string => {
  const date = parseEuropeanDate(dateString);
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date for HTML date input (yyyy-MM-dd)
 */
export const formatForDateInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date for HTML datetime-local input (yyyy-MM-ddTHH:mm)
 */
export const formatForDateTimeInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Parse HTML date input value (yyyy-MM-dd) to Date object
 */
export const parseFromDateInput = (inputValue: string): Date | null => {
  if (!inputValue) return null;
  
  const match = inputValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  
  const [, year, month, day] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

/**
 * Parse HTML datetime-local input value (yyyy-MM-ddTHH:mm) to Date object
 */
export const parseFromDateTimeInput = (inputValue: string): Date | null => {
  if (!inputValue) return null;
  
  const match = inputValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  
  const [, year, month, day, hours, minutes] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
};

/**
 * Check if a date string is in European format
 */
export const isEuropeanDateFormat = (dateString: string): boolean => {
  return /^\d{2}-\d{2}-\d{4}(\s+\d{2}:\d{2})?$/.test(dateString);
};

/**
 * Get today's date in European format
 */
export const getTodayEuropean = (): string => {
  return formatDateEuropean(new Date());
};

/**
 * Get current datetime in European format
 */
export const getNowEuropean = (): string => {
  return formatDateTimeEuropean(new Date());
};
