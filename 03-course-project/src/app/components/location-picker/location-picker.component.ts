import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map as MapIcon } from 'ionicons/icons';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonButton],
})
export class LocationPickerComponent {
  modalCtrl = inject(ModalController);
  httpClient = inject(HttpClient);

  constructor() {
    addIcons({ MapIcon });
  }

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();

        modalEl.onDidDismiss().then((modalData) => {
          const lat = modalData.data.lat;
          const lng = modalData.data.lng;

          if (!modalData.data) {
            return;
          }

          this.getAddressByCoordinates(lat, lng).subscribe(() => {});
        });
      });
  }

  private getAddressByCoordinates(lat: number, lng: number) {
    return this.httpClient
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((geoData: any) => {
          if (!geoData || !geoData.results) {
            return;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }
}
