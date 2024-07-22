import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  constructor(
    private http: HttpClient,
    private dialog: DialogService,
  ) { }

  getAllVehiculos() {
    return this.http.get<Vehiculo[]>('http://localhost:3000/vehiculo')
  }

  getVehiculo(id: number) {
    return this.http.get<Vehiculo>(`http://localhost:3000/vehiculo/${id}`)
  }

  createVehiculo(vehiculo: Vehiculo) {
    return this.http.post<Vehiculo>('http://localhost:3000/vehiculo', vehiculo)
  }

  updateVehiculo(id: number, vehiculo: Vehiculo) {
    return this.http.patch<Vehiculo>(`http://localhost:3000/vehiculo/${id}`, vehiculo)
  }

  deleteVehiculo(id: number) {
    const data = {
      title: 'Confirmar eliminación de vehiculo',
      mensaje: '¿Está seguro de que desea eliminar este vehiculo?',
      color: 'warn',
      nameButton: 'Eliminar',
    };
    const dialogRef = this.dialog.openConfirmationDialog(data);
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.http.delete(`http://localhost:3000/vehiculo/${id}`);
        }
        return of([]);
      })
    );
  }
}
