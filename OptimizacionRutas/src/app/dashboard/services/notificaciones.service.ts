import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  waitTime: number = 3000;

  constructor(private snackBar: MatSnackBar, private router: Router) { }
  redirect(route: string) {
    this.router.navigate([route]);
  }
  showMessageExito(message: string) {
    const snackBarConfig: MatSnackBarConfig = {
      duration: this.waitTime,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    };
    const snackBarRef = this.snackBar.open(message, 'Ok', snackBarConfig);
    snackBarRef.afterDismissed().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
  showMessageError(message: string) {
    const snackBarConfig: MatSnackBarConfig = {
      duration: this.waitTime,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['succes-snackbar'],
    };
    const snackBarRef = this.snackBar.open(message, 'Ok', snackBarConfig);
    snackBarRef.afterDismissed().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
