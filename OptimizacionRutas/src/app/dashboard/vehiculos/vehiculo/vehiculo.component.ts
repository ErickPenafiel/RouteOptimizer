import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { catchError, of, tap } from 'rxjs';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent {
  vehiculoForm: FormGroup;
  edit: boolean = false;
  submittedForm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VehiculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, vehiculo?: Vehiculo, edit?: boolean },
    private fb: FormBuilder,
    private vehiculoService: VehiculosService,
    private notificacionesService: NotificacionesService
  ) {
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anio: ['', [Validators.required]],
      capacidad_carga: ['', [Validators.required]],
    });

    if (this.data.edit) {
      this.edit = true;
      this.vehiculoForm.patchValue(this.data.vehiculo!);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
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
    const vehiculo: Vehiculo = this.vehiculoForm.value;
    this.vehiculoService.createVehiculo(vehiculo)
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
      conductor: this.vehiculoForm.value,
      id: this.data.vehiculo?.id_vehiculo!
    }
    this.vehiculoService.updateVehiculo(result.id, result.conductor)
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
