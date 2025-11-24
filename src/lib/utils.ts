import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a secure random password.
 * Length: 12 characters. Includes uppercase, lowercase, numbers, and symbols.
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  // Ensure at least one of each type for security (optional but good practice)
  const ensureChar = (regex: RegExp, charSet: string) => {
    if (!regex.test(password)) {
      const index = Math.floor(Math.random() * length);
      password = password.substring(0, index) + charSet[Math.floor(Math.random() * charSet.length)] + password.substring(index + 1);
    }
  };

  ensureChar(/[a-z]/, "abcdefghijklmnopqrstuvwxyz");
  ensureChar(/[A-Z]/, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  ensureChar(/[0-9]/, "0123456789");
  ensureChar(/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/, "!@#$%^&*()_+~`|}{[]:;?><,./-=");

  return password;
}