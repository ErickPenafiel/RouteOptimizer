import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';
import { MapCustomComponent } from './map-custom/map-custom.component';
import { ConductoresComponent } from './conductores/conductores.component';
import { ConductorComponent } from './conductores/conductor/conductor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { VehiculoComponent } from './vehiculos/vehiculo/vehiculo.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidoComponent } from './pedidos/pedido/pedido.component';
import { RutasComponent } from './rutas/rutas.component';
import { RutaComponent } from './rutas/ruta/ruta.component';
import { EntregasComponent } from './entregas/entregas.component';
import { EntregaComponent } from './entregas/entrega/entrega.component';
import { MapRutaComponent } from './map-ruta/map-ruta.component';


@NgModule({
  declarations: [
    LayoutComponent,
    MapCustomComponent,
    ConductoresComponent,
    ConductorComponent,
    VehiculosComponent,
    VehiculoComponent,
    ClientesComponent,
    ClienteComponent,
    PedidosComponent,
    PedidoComponent,
    RutasComponent,
    RutaComponent,
    EntregasComponent,
    EntregaComponent,
    MapRutaComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
