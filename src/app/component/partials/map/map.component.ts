import { Component, ElementRef, Inject, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LatLngTuple, LeafletMouseEvent, Map, Marker, tileLayer } from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { Order } from '../../../shared/models/order';
import * as L from 'leaflet';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() order: any;
  @Input() readonly!: boolean;
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = L.icon({
    iconUrl:
        'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];
  @ViewChild('map', { static: true }) mapRef!: ElementRef;
  map!: Map;
  currentMarker!: Marker;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private locationService: LocationService) {}

  ngOnChanges(): void {
    if (!this.order) return;
    if (isPlatformBrowser(this.platformId)) {
      if (!this.map) {
        this.initializeMap();
      }

      if (this.readonly && this.addressLatLng) {
        this.showLocationOnReadonlyMode();
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)){
      this.initializeMap();
    }
  }

  initializeMap(): void {
    if (this.mapRef.nativeElement && !this.map) {
      this.map = L.map(this.mapRef.nativeElement, {
        attributionControl: false
      }).setView(this.DEFAULT_LATLNG, 1);

      tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
      this.map.on('click', (e: LeafletMouseEvent) => {
        this.setMarker(e.latlng);
      });
    }
  }

  showLocationOnReadonlyMode(): void {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  findMyLocation(): void {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      }
    });
  }

  setMarker(latlng: L.LatLngExpression): void {
    this.addressLatLng = latlng as L.LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    this.currentMarker = L.marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });
  }

  set addressLatLng(latlng: L.LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
    console.log(this.order.addressLatLng);
  }

  get addressLatLng(): L.LatLng {
    return this.order.addressLatLng!;
  }
}
