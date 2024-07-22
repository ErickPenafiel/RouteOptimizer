import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MapCustomService } from '../services/map-custom.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map-ruta',
  templateUrl: './map-ruta.component.html',
  styleUrls: ['./map-ruta.component.scss']
})
export class MapRutaComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('asGeocoder') asGeocoder: ElementRef | undefined;
  @ViewChild('asMap') map: ElementRef | undefined;
  wayPoints: WayPoints = { start: null, end: null }
  modeInput = "start"
  id: number = 0

  constructor(
    private mapCustomService: MapCustomService,
    private renderer2: Renderer2,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
    this.mapCustomService.buildMap()
      .then(({ map }) => {
        console.log({ map });

        map.on('load', () => {
          console.log('Mapa cargado completamente');

          setTimeout(() => {
            this.drawRoute();
          }, 1500);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnDestroy(): void {
    this.mapCustomService.disconnectSocket()
  }

  ngOnInit(): void {
    this.mapCustomService.cbAddress.subscribe((getPoint) => {
      if (this.modeInput === 'start') {
        this.wayPoints.start = getPoint
      }

      if (this.modeInput === 'end') {
        this.wayPoints.end = getPoint
      }
    })

    this.id = this.route.snapshot.params['id']
  }

  drawRoute(): void {
    this.mapCustomService.loadCoords(this.id)
  }

  changeMode(mode: string): void {
    this.modeInput = mode
  }

  testMarker(): void {
    console.log("Test marker")
    this.mapCustomService.addMarker([-65.26147409166435, -19.049612104487878], "")
  }
}

export class WayPoints {
  start: any
  end: any
}