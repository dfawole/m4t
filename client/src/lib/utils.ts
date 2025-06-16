import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in minutes to a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (!minutes && minutes !== 0) return "";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

/**
 * Format a number with commas for thousands
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Truncate text to a specified length and add ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
}

/**
 * Get industry icons based on industry name
 * @param industry - Industry name
 * @returns Icon class name
 */
export function getIndustryIcon(industry: string): string {
  const industries: Record<string, string> = {
    "Technology": "laptop-code",
    "Finance": "chart-line",
    "Healthcare": "heartbeat",
    "Education": "graduation-cap",
    "Marketing": "bullhorn",
    "Design": "pencil-ruler",
    "Data Science": "database",
    "Business": "briefcase",
    "Engineering": "cogs",
    "Media": "photo-video"
  };
  
  return industries[industry] || "book";
}