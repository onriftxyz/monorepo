import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
  if (!token) {
    return false;
  }
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url?.replace("-", "+").replace("_", "/");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(window.atob(base64!));
  } catch {
    return false;
  }
}
