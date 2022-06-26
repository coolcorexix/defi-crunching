import { toast } from "react-toastify";

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.info(`${text} copied to clipboard`);
}
