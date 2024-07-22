import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MapCustomService } from '../services/map-custom.service';

@Component({
  selector: 'app-map-custom',
  templateUrl: './map-custom.component.html',
  styleUrls: ['./map-custom.component.scss']
})
export class MapCustomComponent implements OnInit {
  @ViewChild('asGeocoder') asGeocoder: ElementRef | undefined;
  wayPoints: WayPoints = { start: null, end: null }
  modeInput = "start"

  constructor(
    private mapCustomService: MapCustomService,
    private renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    this.mapCustomService.buildMap()
      .then(({ geocoder, map }) => {
        this.renderer2.appendChild(this.asGeocoder?.nativeElement, geocoder.onAdd(map))

        console.log({ geocoder, map })
      })
      .catch((error) => {
        console.error(error)
      })

    this.mapCustomService.cbAddress.subscribe((getPoint) => {
      if (this.modeInput === 'start') {
        this.wayPoints.start = getPoint
      }

      if (this.modeInput === 'end') {
        this.wayPoints.end = getPoint
      }
    })
  }

  drawRoute(): void {
    console.log("Puntos de origen y destino: ", this.wayPoints)

    const coords = [
      this.wayPoints.start.center,
      this.wayPoints.end.center
    ]

    this.mapCustomService.loadCoords(4)
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
