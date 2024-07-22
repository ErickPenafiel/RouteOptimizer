import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, tap } from 'rxjs';
import { Conductor } from 'src/app/interfaces/conductor.interface';
import { ConductorComponent } from './conductor/conductor.component';
import { ConductorService } from '../services/conductor.service';
import { NotificacionesService } from '../services/notificaciones.service';

@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class ConductoresComponent implements OnInit, AfterViewInit {

  conductores: Conductor[] = []
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'ci', 'licencia', 'direccion', 'telefono', 'actions'];

  dataSource: MatTableDataSource<Conductor> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private conductorService: ConductorService,
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
    this.conductorService.getAllConductores()
      .pipe(
        tap((data) => {
          this.conductores = data
          this.dataSource.data = this.conductores
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
    const dialogRef = this.dialog.open(ConductorComponent, {
      data: { title: 'Agregar conductor' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllConductores()
      }
    });
  }

  editConductor(conductor: Conductor) {
    console.log('Edit conductor:', conductor)
    const dialogRef = this.dialog.open(ConductorComponent, {
      data: {
        title: 'Editar conductor',
        conductor,
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
    this.conductorService.deleteConductor(id)
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
