import { ToastContext } from "@/components/ToastProvider";
import { useContext } from "react";

export const useToast = () => useContext(ToastContext);
