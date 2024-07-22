import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Conductor } from 'src/app/interfaces/conductor.interface';
import { ConductorService } from '../../services/conductor.service';
import { catchError, of, tap } from 'rxjs';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.scss']
})
export class ConductorComponent {
  conductorForm: FormGroup;
  edit: boolean = false;
  submittedForm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConductorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, conductor?: Conductor, edit?: boolean },
    private fb: FormBuilder,
    private conductorService: ConductorService,
    private notificacionesService: NotificacionesService
  ) {
    this.conductorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern]],
      apellido: ['', [Validators.required, Validators.pattern]],
      ci: ['', [Validators.required, Validators.pattern]],
      licencia: ['', [Validators.required, Validators.pattern]],
      direccion: ['', [Validators.required, Validators.pattern]],
      telefono: ['', [Validators.required, Validators.pattern]]
    });

    if (this.data.edit) {
      this.edit = true;
      this.conductorForm.patchValue(this.data.conductor!);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.conductorForm.invalid) {
      return;
    }
    this.submittedForm = true;
    if (this.edit) {
      this.editConductor();
    } else {
      this.addConductor();
    }

  }

  addConductor() {
    const conductor: Conductor = this.conductorForm.value;
    this.conductorService.createConductor(conductor)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Conductor creado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al crear conductor')
          return of([])
        })
      ).subscribe()
  }

  editConductor() {
    const result = {
      conductor: this.conductorForm.value,
      id: this.data.conductor?.id_conductor!
    }
    this.conductorService.updateConductor(result.id, result.conductor)
      .pipe(
        tap((data) => {
          console.log('Data:', data)
          this.notificacionesService.showMessageExito('Conductor actualizado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al actualizar conductor')
          this.dialogRef.close(false)
          return of([])
        })
      ).subscribe()
  }
}
