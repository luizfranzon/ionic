import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader],
})
export class MapModalComponent implements AfterViewInit {
  modalCtrl = inject(ModalController);
  renderer = inject(Renderer2);

  mapRef = viewChild<ElementRef>('map');

  newMap = signal<GoogleMap | null>(null);

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  async loadGoogleMaps() {
    const map = await GoogleMap.create({
      id: 'map',
      apiKey: environment.googleMapsApiKey,
      element: this.mapRef()?.nativeElement,
      config: {
        center: {
          lat: -23.55052,
          lng: -46.633308,
        },
        zoom: 12,
      },
    });

    map.setOnMapClickListener((event) => {
      const selectedCoords = {
        lat: event.latitude,
        lng: event.longitude,
      };

      this.modalCtrl.dismiss(selectedCoords, 'selected');
    });

    this.newMap.set(map);
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}

//
