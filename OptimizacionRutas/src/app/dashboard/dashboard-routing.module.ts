import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MapCustomComponent } from './map-custom/map-custom.component';
import { ConductoresComponent } from './conductores/conductores.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { RutasComponent } from './rutas/rutas.component';
import { EntregasComponent } from './entregas/entregas.component';
import { MapRutaComponent } from './map-ruta/map-ruta.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'rutas/map/:id',
        component: MapRutaComponent
      },
      {
        path: 'conductores',
        component: ConductoresComponent
      },
      {
        path: 'vehiculos',
        component: VehiculosComponent
      },
      {
        path: 'clientes',
        component: ClientesComponent
      },
      {
        path: 'pedidos',
        component: PedidosComponent
      },
      {
        path: 'rutas',
        component: RutasComponent
      },
      {
        path: 'entregas',
        component: EntregasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
