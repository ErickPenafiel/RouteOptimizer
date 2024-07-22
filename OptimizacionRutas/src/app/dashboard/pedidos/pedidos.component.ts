import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from 'src/app/interfaces/pedido.interface';
import { PedidosService } from '../services/pedidos.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';
import { PedidoComponent } from './pedido/pedido.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent {
  pedidos: Pedido[] = []
  displayedColumns: string[] = ['id', 'latitud', 'longitud', 'cliente', 'actions'];

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private pedidosService: PedidosService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.getAllPedidos()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllPedidos() {
    this.pedidosService.getAllPedidos()
      .pipe(
        tap((data) => {
          this.pedidos = data
          this.dataSource.data = this.pedidos
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

  addPedido() {
    const dialogRef = this.dialog.open(PedidoComponent, {
      data: { title: 'Agregar pedido' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllPedidos()
      }
    });
  }

  editPedido(pedido: Pedido) {
    console.log('Edit pedido:', pedido)
    const dialogRef = this.dialog.open(PedidoComponent, {
      data: {
        title: 'Editar pedido',
        pedido,
        edit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllPedidos()
      }
    });
  }

  deletePedido(id: number) {
    this.pedidosService.deletePedido(id)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Pedido eliminado con éxito')
          this.getAllPedidos()
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al eliminar pedido')
          return of([])
        })
      ).subscribe()
  }
}
