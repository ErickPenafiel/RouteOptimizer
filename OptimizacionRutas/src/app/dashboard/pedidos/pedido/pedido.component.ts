import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pedido } from 'src/app/interfaces/pedido.interface';
import { PedidosService } from '../../services/pedidos.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {
  pedidoForm: FormGroup;
  edit: boolean = false;
  submittedForm: boolean = false;
  loading: boolean = false;

  clienteOptions: Cliente[] = [];
  filteredClientOptions: Observable<Cliente[]> = new Observable<Cliente[]>();

  constructor(
    public dialogRef: MatDialogRef<PedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, pedido?: Pedido, edit?: boolean },
    private fb: FormBuilder,
    private pedidoService: PedidosService,
    private clienteService: ClienteService,
    private notificacionesService: NotificacionesService
  ) {
    this.pedidoForm = this.fb.group({
      latitud: ['', [Validators.required]],
      longitud: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
    });

    if (this.data.edit) {
      this.edit = true;
      this.pedidoForm.patchValue(this.data.pedido!);
    }
  }
  ngOnInit(): void {
    this.getClienteOptions();
    this.filteredClientOptions = this.pedidoForm.controls['cliente'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const cliente = typeof value === 'string' ? value : value?.apellidos;
        return cliente ? this._filterCliente((cliente as string) || '') : this.clienteOptions.slice();
      })
    );
  }

  private _filterCliente(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.clienteOptions.filter(option => option.apellidos.toLowerCase().includes(filterValue));
  }

  displayCliente(cliente?: Cliente): string {
    return cliente ? `${cliente.apellidos} ${cliente.nombre}` : ''
  }

  getClienteOptions() {
    this.loading = true;
    this.clienteService.getAllClientes()
      .pipe(
        tap((result: any) => {
          this.clienteOptions = result;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          return of(error);
        })
      ).subscribe()
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      return;
    }
    this.submittedForm = true;
    if (this.edit) {
      this.editPedido();
    } else {
      this.addPedido();
    }

  }

  addPedido() {
    const pedido: Pedido = {
      latitud: this.pedidoForm.value.latitud,
      longitud: this.pedidoForm.value.longitud,
      clienteIdCliente: this.pedidoForm.value.cliente.id_cliente
    };
    console.log('Pedido:', pedido)
    this.pedidoService.createPedido(pedido)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Pedido creado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al crear pedido')
          return of([])
        })
      ).subscribe()
  }

  editPedido() {
    const result = {
      conductor: {
        latitud: this.pedidoForm.value.latitud,
        longitud: this.pedidoForm.value.longitud,
        clienteIdCliente: this.pedidoForm.value.cliente.id_cliente
      },
      id: this.data.pedido?.id_pedido!
    }
    this.pedidoService.updatePedido(result.id, result.conductor)
      .pipe(
        tap((data) => {
          console.log('Data:', data)
          this.notificacionesService.showMessageExito('Pedido actualizado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al actualizar pedido')
          this.dialogRef.close(false)
          return of([])
        })
      ).subscribe()
  }
}
