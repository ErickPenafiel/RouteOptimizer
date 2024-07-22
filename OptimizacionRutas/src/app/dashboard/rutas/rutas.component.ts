import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ruta } from 'src/app/interfaces/ruta.interface';
import { RutasService } from '../services/rutas.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';
import { RutaComponent } from './ruta/ruta.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent {
  rutas: Ruta[] = []
  displayedColumns: string[] = ['id', 'ruta_optimizada', 'actions'];

  dataSource: MatTableDataSource<Ruta> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private rutasService: RutasService,
    private notificacionesService: NotificacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllRutas()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllRutas() {
    this.rutasService.getAllRutas()
      .pipe(
        tap((data: any) => {
          this.rutas = data
          this.dataSource.data = this.rutas
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

  addRuta() {
    const dialogRef = this.dialog.open(RutaComponent, {
      data: { title: 'Agregar ruta' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllRutas()
      }
    });
  }

  editRuta(ruta: Ruta) {
    console.log('Edit ruta:', ruta)
    const dialogRef = this.dialog.open(RutaComponent, {
      data: {
        title: 'Editar pedido',
        ruta,
        edit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllRutas()
      }
    });
  }

  deletePedido(id: number) {
    this.rutasService.deleteRuta(id)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Pedido eliminado con éxito')
          this.getAllRutas()
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al eliminar pedido')
          return of([])
        })
      ).subscribe()
  }

  mostrarRuta(id: number) {
    this.router.navigate(['/dashboard/rutas/map', id])
  }
}
