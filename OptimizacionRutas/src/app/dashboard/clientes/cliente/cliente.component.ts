import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from '../../services/cliente.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent {
  clienteForm: FormGroup;
  edit: boolean = false;
  submittedForm: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, cliente?: Cliente, edit?: boolean },
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private notificacionesService: NotificacionesService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
    });

    if (this.data.edit) {
      this.edit = true;
      this.clienteForm.patchValue(this.data.cliente!);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
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
    const cliente: Cliente = this.clienteForm.value;
    this.clienteService.createCliente(cliente)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Cliente creado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al crear cliente')
          return of([])
        })
      ).subscribe()
  }

  editConductor() {
    const result = {
      conductor: this.clienteForm.value,
      id: this.data.cliente?.id_cliente!
    }
    this.clienteService.updateCliente(result.id, result.conductor)
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
