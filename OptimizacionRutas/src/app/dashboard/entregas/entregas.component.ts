import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, tap } from 'rxjs';
import { Entrega } from 'src/app/interfaces/entregas.interface';
import { EntregaService } from '../services/entrega.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { EntregaComponent } from './entrega/entrega.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss']
})
export class EntregasComponent {
  entregas: Entrega[] = []
  displayedColumns: string[] = ['id', 'ruta', 'conductor', 'vehiculo', 'actions'];

  dataSource: MatTableDataSource<Entrega> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private entregaService: EntregaService,
    private notificacionesService: NotificacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllEntregas()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllEntregas() {
    this.entregaService.getAllEntregas()
      .pipe(
        tap((data) => {
          this.entregas = data
          this.dataSource.data = this.entregas
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

  addEntrega() {
    const dialogRef = this.dialog.open(EntregaComponent, {
      width: '600px',
      data: { title: 'Agregar entrega' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllEntregas()
      }
    });
  }

  editEntrega(entrega: Entrega) {
    console.log('Edit entrega:', entrega)
    const dialogRef = this.dialog.open(EntregaComponent, {
      data: {
        title: 'Editar entrega',
        entrega,
        edit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllEntregas()
      }
    });
  }

  deleteEntrega(id: number) {
    this.entregaService.deleteEntrega(id)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Entrega eliminada con éxito')
          this.getAllEntregas()
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al eliminar entrega')
          return of([])
        })
      ).subscribe()
  }

  mostrarRuta(id: number) {
    this.router.navigate(['/dashboard/rutas/map', id])
  }
}
