import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Ruta } from 'src/app/interfaces/ruta.interface';
import { PedidosService } from '../../services/pedidos.service';
import { ClienteService } from '../../services/cliente.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pedido } from 'src/app/interfaces/pedido.interface';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { RutasService } from '../../services/rutas.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.scss']
})
export class RutaComponent {
  pedidos: Pedido[] = []
  displayedColumns: string[] = ['select', 'id', 'latitud', 'longitud', 'cliente', 'actions'];

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<Pedido>(true, []);

  constructor(
    public dialogRef: MatDialogRef<RutaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, pedido?: Pedido, edit?: boolean },
    private http: HttpClient,
    private pedidosService: PedidosService,
    private rutasService: RutasService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.getAllPedidos()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllPedidos() {
    this.pedidosService.getAllPedidosAsignar()
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  addRuta() {
    const pedidos = this.getSelectedElements();

    this.rutasService.optimizarRutas(pedidos)
      .pipe(
        tap((result: any) => {
          this.notificacionesService.showMessageExito('Rutas optimizadas correctamente')
          this.dialogRef.close(true)
        }),
        catchError((error) => {
          this.notificacionesService.showMessageError('Error al optimizar rutas')
          return of(error)
        })
      ).subscribe()
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Pedido): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_pedido! + 1
      }`;
  }

  getSelectedElements(): Pedido[] {
    return this.selection.selected;
  }

  openGoogleMaps(latitud: number, longitud: number) {
    const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
    window.open(url, '_blank');
  }
}
