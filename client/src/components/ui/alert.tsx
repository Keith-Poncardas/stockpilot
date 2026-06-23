import type { ReactNode } from "react";
import {
  CircleX,
  CircleCheck,
  TriangleAlert,
  Info,
} from "lucide-react";

type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variants = {
  error: {
    container:
      "border border-red-200 bg-red-50 text-red-800",
    icon: <CircleX className="size-4 shrink-0" />,
  },
  success: {
    container:
      "border border-green-200 bg-green-50 text-green-800",
    icon: <CircleCheck className="size-4 shrink-0" />,
  },
  warning: {
    container:
      "border border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: <TriangleAlert className="size-4 shrink-0" />,
  },
  info: {
    container:
      "border border-blue-200 bg-blue-50 text-blue-800",
    icon: <Info className="size-4 shrink-0" />,
  },
} satisfies Record<
  AlertVariant,
  {
    container: string;
    icon: ReactNode;
  }
>;

export default function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`flex items-center gap-3 mb-5 rounded-lg px-4 py-3 text-sm ${variants[variant].container} ${className}`}
    >
      {variants[variant].icon}
      <div>{children}</div>
    </div>
  );
}