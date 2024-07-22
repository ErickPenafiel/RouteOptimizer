import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/app/enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {
  cbAddress: EventEmitter<any> = new EventEmitter()

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = -19.04774546583437
  long = -65.25966877045035
  zoom = 5
  wayPoints: Array<any> = []
  markerDriver: any
  socket: any;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.mapbox.accessToken = environment.apiKeyMapBox
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('newLocation', (location: { latitude: number, longitude: number }) => {
      const lngLat = [location.longitude, location.latitude] as [number, number];
      this.addMarkerDriver(lngLat, 'Conductor')
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('WebSocket connection closed manually');
    }
  }

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.long, this.lat]
        })

        resolve({ map: this.map })
      } catch (error) {
        reject(error)
      }
    })
  }

  loadCoords(id: number): void {

    this.httpClient.get(`http://localhost:3000/rutas/${id}`)
      .pipe(
        tap((response: any) => {
          console.log(response)
          const route = response.ruta_optimizada
          const pedidos = response.pedidos

          this.map?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            }
          })

          this.map?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'red',
              'line-width': 5,
            }
          })

          this.wayPoints = route
          this.map?.fitBounds([route[0], route[route.length - 1]], {
            padding: 150
          })

          pedidos.forEach((pedido: any) => {
            this.addMarker([pedido.longitud, pedido.latitud], `Pedido N° ${pedido.id_pedido}`)
          })

        }),
        catchError((error) => {
          console.error(error)
          return of(error)
        })
      ).subscribe()

    // console.log(url)
  }


  addMarker(coords: any, tooltipText: string): void {
    console.log("coords", coords)
    const el = document.createElement('div')
    el.style.width = '32px'
    el.style.height = '32px'
    el.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png)'
    el.style.backgroundSize = 'cover'
    el.style.cursor = 'pointer'
    const marker: any = new mapboxgl.Marker(el)
    marker
      .setLngLat(coords)
      .addTo(this.map)

    const popup = new mapboxgl.Popup({ offset: 25 }).setText(tooltipText);

    // Asociar el tooltip al marcador
    marker.setPopup(popup);
  }

  addMarkerDriver(coords: any, tooltipText: string): void {
    console.log("coords", coords)
    const el = document.createElement('div')
    el.style.width = '32px'
    el.style.height = '32px'
    // Icono de auto
    el.style.backgroundImage = 'url("https://cdn0.iconfinder.com/data/icons/isometric-city-basic-transport/480/car-front-02-512.png")'
    el.style.backgroundSize = 'cover'
    el.style.cursor = 'pointer'
    if (!this.markerDriver) {
      this.markerDriver = new mapboxgl.Marker(el)
    } else {
      this.markerDriver
        .setLngLat(coords)
        .addTo(this.map)
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setText(tooltipText);
    this.markerDriver.setPopup(popup);
  }
}
