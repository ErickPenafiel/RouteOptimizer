import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;
  menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard'
    },
    // {
    //   title: 'Map',
    //   icon: 'map',
    //   link: '/dashboard/map'
    // },
    {
      title: 'Conductores',
      icon: 'people',
      link: '/dashboard/conductores'
    },
    {
      title: 'Vehículos',
      icon: 'directions_car',
      link: '/dashboard/vehiculos'
    },
    {
      title: 'Clientes',
      icon: 'person',
      link: '/dashboard/clientes'
    },
    {
      title: 'Pedidos',
      icon: 'shopping_cart',
      link: '/dashboard/pedidos'
    },
    {
      title: 'Rutas',
      icon: 'timeline',
      link: '/dashboard/rutas'
    },
    {
      title: 'Entregas',
      icon: 'local_shipping',
      link: '/dashboard/entregas'
    }
  ]

  constructor(private observer: BreakpointObserver) { }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
