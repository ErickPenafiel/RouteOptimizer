import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from 'src/app/interfaces/dialog.interface';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent {
  dialogData: Dialog = {
    title: '',
    mensaje: '',
    color: '',
    nameButton: '',
    confirmCheckbox: false,
    confirm: false,
    confirmText: '',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogConfirmationComponent>
  ) { }
  ngOnInit() {
    this.dialogData.title = this.data.title;
    this.dialogData.mensaje = this.data.mensaje;
    this.dialogData.color = this.data.color;
    this.dialogData.nameButton = this.data.nameButton;
    this.dialogData.confirmCheckbox =
      this.data.confirmCheckbox || this.dialogData.confirmCheckbox;
    this.dialogData.confirm = this.data.confirm || this.dialogData.confirm;
    this.dialogData.confirmText =
      this.data.confirmText || this.dialogData.confirmText;
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

}
