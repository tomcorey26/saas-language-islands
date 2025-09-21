import { CheckCircleIcon, XCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "error" | "info" | "warning";

interface StatusMessageProps {
  type: StatusType;
  title: string;
  message: string;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircleIcon,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  error: {
    icon: XCircleIcon,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  info: {
    icon: InfoIcon,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
  warning: {
    icon: AlertTriangleIcon,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
    messageColor: "text-yellow-700",
  },
} as const;

export function StatusMessage({ type, title, message, className }: StatusMessageProps) {
  const config = statusConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-lg border flex items-center gap-3",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <Icon className={cn("w-5 h-5 flex-shrink-0", config.iconColor)} />
      <div>
        <h3 className={cn("font-semibold", config.titleColor)}>{title}</h3>
        <p className={cn("text-sm", config.messageColor)}>{message}</p>
      </div>
    </div>
  );
}

interface ConditionalStatusMessageProps {
  searchParams: { success?: string; error?: string };
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  className?: string;
}

export function ConditionalStatusMessage({
  searchParams,
  successTitle = "Success!",
  successMessage = "Your request has been processed successfully.",
  errorTitle = "Error",
  errorMessage = "Something went wrong. Please try again.",
  className,
}: ConditionalStatusMessageProps) {
  if (searchParams.success) {
    return (
      <StatusMessage
        type="success"
        title={successTitle}
        message={successMessage}
        className={className}
      />
    );
  }

  if (searchParams.error) {
    return (
      <StatusMessage
        type="error"
        title={errorTitle}
        message={errorMessage}
        className={className}
      />
    );
  }

  return null;
}