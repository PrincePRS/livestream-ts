import React from "react";
import { Toast as ToastPrimitive } from "@100mslive/react-ui";

export interface ToastDataProps {
  id: string;
  title: string;
  description?: string;
  close: boolean;
  open: boolean;
  duration: number;
  isClosable?: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: React.ReactNode;
}

export const Toast: React.FC<ToastDataProps> = ({
  title,
  description,
  close = true,
  open,
  duration,
  onOpenChange,
  icon,
  ...props
}) => {
  return (
    <ToastPrimitive.HMSToast
      title={title}
      description={description}
      open={open}
      isClosable={close}
      onOpenChange={onOpenChange}
      duration={!close ? 600000 : duration}
      icon={icon}
      {...props}
    />
  );
};
