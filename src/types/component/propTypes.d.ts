import { Service } from "@/service/apiService";
import { UseMutationResult } from "@tanstack/react-query";

export type IconProps = {
  width: string;
  height: string;
  color?: string;
};

export type IconButtonProps = {
  icon: JSX.Element;
  tooltipMsg: string;
  handleOnClick: () => void;
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "secondary";
  disabled?: boolean;
};

export type Option = {
  label: string;
  value: string;
};

export type FormSelectProps = {
  options: Option[];
  selectLabel: string;
  placeholder: string;
};

export type FormModalProps = {
  show?: boolean;
  onClose?: () => void;
  title: string;
  titleDescription?: string;
  component: JSX.Element;
  service?: Service;
  buttonIcon?: JSX.Element;
  buttonTitle?: string;
  dialogFooter?: JSX.Element;
  setShow?: (show: boolean) => void;
};

export interface ToastFunction {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
}

export type COnfirmationModalProps = {
  show: boolean;
  onClose: () => void;
  title: string;
  titleDescription?: string;
  onConfirm: () => void;
};

export type ChequeSettleModalProps = {
  show: boolean;
  onClose: () => void;
  title: string;
  onSettle: () => void;
  onReject: () => void;
  settleCheckMutation?: UseMutationResult;
};
