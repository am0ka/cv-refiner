import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const processFileUploadErrorMessage = (message: string) => {
  if (message.includes("mime type")) {
    return "Invalid file type. Please upload a PDF.";
  }
  if (message.includes("row level security")) {
    return "Storage is not properly configured. Please contact support.";
  }
  return "An unexpected error occurred. Please try again.";
};
