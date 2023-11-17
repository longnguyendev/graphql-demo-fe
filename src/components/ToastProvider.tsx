import { Alert, AlertColor, Snackbar } from "@mui/material";
import { PropsWithChildren, createContext, useState } from "react";

interface ToastProps {
  message: string;
  status: AlertColor;
}

type ToastContextProps = (data: ToastProps) => void;

const defaultValue: ToastContextProps = () => null;

export const ToastContext = createContext<ToastContextProps>(defaultValue);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toastData, setToastData] = useState<ToastProps | null>(null);

  const toast = (data: ToastProps) => setToastData(data);

  const onClose = () => setToastData(null);

  return (
    <ToastContext.Provider value={toast}>
      {toastData && (
        <Snackbar open={true} autoHideDuration={3000} onClose={onClose}>
          <Alert
            onClose={onClose}
            severity={toastData.status}
            sx={{ width: "100%" }}
          >
            {toastData.message}
          </Alert>
        </Snackbar>
      )}
      {children}
    </ToastContext.Provider>
  );
}
