import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname === "localhost") return true;
    
    // Domain must have at least one dot and end with a 2+ character TLD
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(url.hostname);
  } catch {
    return false;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeDomainInput(value: string) {
  let cleanValue = value.trim();
  let nextProtocol: "http://" | "https://" | null = null;
  if (cleanValue.startsWith("https://")) {
    nextProtocol = "https://";
    cleanValue = cleanValue.slice(8);
  } else if (cleanValue.startsWith("http://")) {
    nextProtocol = "http://";
    cleanValue = cleanValue.slice(7);
  }
  return { cleanValue, nextProtocol };
}