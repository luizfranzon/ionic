import { Component, inject, output, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonLabel,
  IonIcon,
  IonImg,
  IonThumbnail,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map as MapIcon } from 'ionicons/icons';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlaceLocation } from 'src/app/models/locations.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonImg,
    IonIcon,
    IonLabel,
    IonButton,
    IonThumbnail,
    CommonModule,
  ],
})
export class LocationPickerComponent {
  modalCtrl = inject(ModalController);
  httpClient = inject(HttpClient);

  locationPick = output<PlaceLocation>();

  selectedLocationImage = signal<null | string>(null);
  isLoadingLocationImage = signal<boolean>(false);

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
          const { lat, lng } = modalData.data;

          this.isLoadingLocationImage.set(true);

          if (!modalData.data) {
            return;
          }

          const pickedLocation: PlaceLocation = {
            lat,
            lng,
            address: null!,
            staticMapImageUrl: null!,
          };

          this.getAddressByCoordinates(lat, lng)
            .pipe(
              switchMap((address) => {
                pickedLocation.address = address;
                return of(
                  this.getMapImage(pickedLocation.lat, pickedLocation.lng, 18)
                );
              })
            )
            .subscribe((staticMapImageUrl) => {
              pickedLocation.staticMapImageUrl = staticMapImageUrl;
              this.selectedLocationImage.set(staticMapImageUrl);

              this.locationPick.emit(pickedLocation);
              this.isLoadingLocationImage.set(false);
              this.locationPick.emit(pickedLocation);
            });
        });
      });
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`;
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
