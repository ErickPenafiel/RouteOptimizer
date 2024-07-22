import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/components/dialog-confirmation/dialog-confirmation.component';
import { Dialog } from 'src/app/interfaces/dialog.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }
  openConfirmationDialog(
    data: Dialog
  ): MatDialogRef<DialogConfirmationComponent> {
    return this.dialog.open(DialogConfirmationComponent, {
      data: data,
    });
  }

}
