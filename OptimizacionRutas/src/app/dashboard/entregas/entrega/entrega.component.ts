import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { Entrega } from 'src/app/interfaces/entregas.interface';
import { EntregaService } from '../../services/entrega.service';
import { RutasService } from '../../services/rutas.service';
import { ConductorService } from '../../services/conductor.service';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { VehiculosService } from '../../services/vehiculos.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Ruta } from 'src/app/interfaces/ruta.interface';
import { Conductor } from 'src/app/interfaces/conductor.interface';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss']
})
export class EntregaComponent {
  entregaForm: FormGroup;
  edit: boolean = false;
  submittedForm: boolean = false;
  loading: boolean = false;

  rutaOptions: Ruta[] = [];
  filteredRutaOptions: Observable<Ruta[]> = new Observable<Ruta[]>();

  conductorOptions: Conductor[] = [];
  filteredConductorOptions: Observable<Conductor[]> = new Observable<Conductor[]>();

  vehiculoOptions: Vehiculo[] = [];
  filteredVehiculoOptions: Observable<Vehiculo[]> = new Observable<Vehiculo[]>();

  constructor(
    public dialogRef: MatDialogRef<EntregaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, entrega?: Entrega, edit?: boolean },
    private fb: FormBuilder,
    private entregaService: EntregaService,
    private rutasService: RutasService,
    private conductorService: ConductorService,
    private vehiculoService: VehiculosService,
    private notificacionesService: NotificacionesService
  ) {
    this.entregaForm = this.fb.group({
      ruta: ['', [Validators.required]],
      conductor: ['', [Validators.required]],
      vehiculo: ['', [Validators.required]],
    });

    if (this.data.edit) {
      this.edit = true;
      this.entregaForm.patchValue(this.data.entrega!);
    }
  }
  ngOnInit(): void {
    this.getRutaOptions();
    this.getConductoresOptions();
    this.getVehiculoOptions();

    this.filteredRutaOptions = this.entregaForm.controls['ruta'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const ruta = typeof value === 'string' ? value : value?.id_ruta.toString();
        return ruta ? this._filterRuta((ruta as string) || '') : this.rutaOptions.slice();
      })
    );

    this.filteredConductorOptions = this.entregaForm.controls['conductor'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const conductor = typeof value === 'string' ? value : value?.apellido.toString();
        return conductor ? this._filterConductor((conductor as string) || '') : this.conductorOptions.slice();
      })
    );

    this.filteredVehiculoOptions = this.entregaForm.controls['vehiculo'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const vehiculo = typeof value === 'string' ? value : value?.placa.toString();
        return vehiculo ? this._filterVehiculo((vehiculo as string) || '') : this.vehiculoOptions.slice();
      })
    );
  }

  private _filterRuta(value: string): Ruta[] {
    const filterValue = value.toLowerCase();
    return this.rutaOptions.filter(option => option.id_ruta?.toString().toLowerCase().includes(filterValue));
  }

  displayRuta(ruta?: Ruta): string {
    return ruta ? `Ruta N° ${ruta.id_ruta}` : ''
  }

  getRutaOptions() {
    this.loading = true;
    this.rutasService.getAllRutas()
      .pipe(
        tap((result: any) => {
          this.rutaOptions = result;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          return of(error);
        })
      ).subscribe()
  }

  private _filterConductor(value: string): Conductor[] {
    const filterValue = value.toLowerCase();
    return this.conductorOptions.filter(option => option.apellido?.toLowerCase().includes(filterValue));
  }

  displayConductor(conductor?: Conductor): string {
    return conductor ? `${conductor.apellido} ${conductor.nombre} ${conductor.ci}` : ''
  }

  getConductoresOptions() {
    this.loading = true;
    this.conductorService.getAllConductores()
      .pipe(
        tap((result: any) => {
          this.conductorOptions = result;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          return of(error);
        })
      ).subscribe()
  }

  private _filterVehiculo(value: string): Vehiculo[] {
    const filterValue = value.toLowerCase();
    return this.vehiculoOptions.filter(option => option.placa?.toLowerCase().includes(filterValue));
  }

  displayVehiculo(conductor?: Vehiculo): string {
    return conductor ? `${conductor.marca} ${conductor.modelo} - ${conductor.placa}` : ''
  }

  getVehiculoOptions() {
    this.loading = true;
    this.vehiculoService.getAllVehiculos()
      .pipe(
        tap((result: any) => {
          this.vehiculoOptions = result;
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
    if (this.entregaForm.invalid) {
      return;
    }
    this.submittedForm = true;
    if (this.edit) {
      this.editEntrega();
    } else {
      this.addEntrega();
    }

  }

  addEntrega() {
    const entrega: Entrega = {
      id_ruta: this.entregaForm.value.ruta.id_ruta,
      id_conductor: this.entregaForm.value.conductor.id_conductor,
      id_vehiculo: this.entregaForm.value.vehiculo.id_vehiculo
    };
    console.log('Entrega:', entrega)
    this.entregaService.createEntrega(entrega)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Entrega creado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al crear entrega')
          return of([])
        })
      ).subscribe()
  }

  editEntrega() {
    const result = {
      entrega: {
        id_ruta: this.entregaForm.value.ruta.id_ruta,
        id_conductor: this.entregaForm.value.conductor.id_conductor,
        id_vehiculo: this.entregaForm.value.vehiculo.id_vehiculo
      },
      id: this.data.entrega?.id_entrega!
    }
    this.entregaService.updateEntrega(result.id, result.entrega)
      .pipe(
        tap((data) => {
          console.log('Data:', data)
          this.notificacionesService.showMessageExito('Entrega actualizado con éxito')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al actualizar entrega')
          this.dialogRef.close(false)
          return of([])
        })
      ).subscribe()
  }
}
