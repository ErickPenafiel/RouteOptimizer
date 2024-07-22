import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { NotificacionesService } from '../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { VehiculosService } from '../services/vehiculos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent {
  vehiculos: Vehiculo[] = []
  displayedColumns: string[] = ['id', 'placa', 'marca', 'modelo', 'anio', 'capacidad_carga', 'actions'];

  dataSource: MatTableDataSource<Vehiculo> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private vehiculosService: VehiculosService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.getAllConductores()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllConductores() {
    this.vehiculosService.getAllVehiculos()
      .pipe(
        tap((data) => {
          this.vehiculos = data
          this.dataSource.data = this.vehiculos
        }),
        catchError((error) => {
          console.error('Error:', error)
          return of([])
        })
      ).subscribe()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addConductor() {
    const dialogRef = this.dialog.open(VehiculoComponent, {
      data: { title: 'Agregar vehiculo' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllConductores()
      }
    });
  }

  editConductor(vehiculo: Vehiculo) {
    console.log('Editar vehiculo:', vehiculo)
    const dialogRef = this.dialog.open(VehiculoComponent, {
      data: {
        title: 'Editar vehiculo',
        vehiculo,
        edit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllConductores()
      }
    });
  }

  deleteConductor(id: number) {
    this.vehiculosService.deleteVehiculo(id)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Conductor eliminado con éxito')
          this.getAllConductores()
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al eliminar conductor')
          return of([])
        })
      ).subscribe()
  }
}
