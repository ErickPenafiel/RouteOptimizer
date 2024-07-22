import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from '../services/cliente.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { catchError, of, tap } from 'rxjs';
import { ClienteComponent } from './cliente/cliente.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent {
  clientes: Cliente[] = []
  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'actions'];

  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.getAllClientes()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllClientes() {
    this.clienteService.getAllClientes()
      .pipe(
        tap((data) => {
          this.clientes = data
          this.dataSource.data = this.clientes
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

  addCliente() {
    const dialogRef = this.dialog.open(ClienteComponent, {
      data: { title: 'Agregar cliente' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllClientes()
      }
    });
  }

  editCliente(cliente: Cliente) {
    console.log('Edit cliente:', cliente)
    const dialogRef = this.dialog.open(ClienteComponent, {
      data: {
        title: 'Editar cliente',
        cliente,
        edit: true
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(`Dialog result: `, result);

      if (result) {
        this.dialog.closeAll()
        this.getAllClientes()
      }
    });
  }

  deleteCliente(id: number) {
    this.clienteService.deleteCliente(id)
      .pipe(
        tap((data) => {
          this.notificacionesService.showMessageExito('Cliente eliminado con éxito')
          this.getAllClientes()
        }),
        catchError((error) => {
          console.error('Error:', error)
          this.notificacionesService.showMessageError('Error al eliminar cliente')
          return of([])
        })
      ).subscribe()
  }
}
