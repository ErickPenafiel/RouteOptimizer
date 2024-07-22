export interface Dialog {
  title: string;
  mensaje: string;
  color: string;
  nameButton: string;
  confirmCheckbox?: boolean;
  confirm?: boolean;
  confirmText?: string;
}
export interface DialogReject {
  title: string;
  mensaje: string;
  color: string;
  nameButton: string;
  confirmCheckbox?: boolean;
  confirm?: boolean;
  confirmText?: string;
}
