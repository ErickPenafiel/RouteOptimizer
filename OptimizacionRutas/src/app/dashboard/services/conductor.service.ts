import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Conductor } from 'src/app/interfaces/conductor.interface';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  constructor(
    private http: HttpClient,
    private dialog: DialogService,
  ) { }

  getAllConductores() {
    return this.http.get<Conductor[]>('http://localhost:3000/conductores')
  }

  getConductor(id: number) {
    return this.http.get<Conductor>(`http://localhost:3000/conductores/${id}`)
  }

  createConductor(conductor: Conductor) {
    return this.http.post<Conductor>('http://localhost:3000/conductores', conductor)
  }

  updateConductor(id: number, conductor: Conductor) {
    return this.http.patch<Conductor>(`http://localhost:3000/conductores/${id}`, conductor)
  }

  deleteConductor(id: number) {
    const data = {
      title: 'Confirmar eliminación de conductor',
      mensaje: '¿Está seguro de que desea eliminar este conductor?',
      color: 'warn',
      nameButton: 'Eliminar',
    };
    const dialogRef = this.dialog.openConfirmationDialog(data);
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.http.delete(`http://localhost:3000/conductores/${id}`);
        }
        return of([]);
      })
    );
  }
}
