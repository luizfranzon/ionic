import { of, switchMap } from 'rxjs';
import {
  IonButton,
  IonLabel,
  IonIcon,
  IonImg,
  IonThumbnail,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { map as MapIcon } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { PlaceLocation } from 'src/app/models/locations.model';
import { Component, inject, input, output, signal } from '@angular/core';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

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
  httpClient = inject(HttpClient);
  modalCtrl = inject(ModalController);
  googleMapsService = inject(GoogleMapsService);
  actionSheetCtrl = inject(ActionSheetController);

  showPreviewImage = input<boolean>(false);

  locationPick = output<PlaceLocation>();

  isLoadingLocationImage = signal<boolean>(false);
  selectedLocationImage = signal<null | string>(null);

  constructor() {
    addIcons({ MapIcon });
  }

  public onPickLocation() {
    const actionSheetOptions = {
      header: 'Please choose one',
      buttons: [
        {
          text: 'Auto location',
          handler: () => {
            this.locateUserByGeolocation();
          },
        },
        {
          text: 'Pick on map',
          handler: () => {
            this.presentChooseLocationModal();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    };

    this.actionSheetCtrl.create(actionSheetOptions).then((modalEl) => {
      modalEl.present();
    });
  }

  private async locateUserByGeolocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = coordinates.coords;

    this.createPlace(latitude, longitude);
  }

  private presentChooseLocationModal() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();

        modalEl.onDidDismiss().then((modalData) => {
          const { lat, lng } = modalData.data;

          if (!modalData.data) {
            return;
          }

          this.createPlace(lat, lng);
        });
      });
  }

  private createPlace(latitude: number, longitude: number) {
    this.isLoadingLocationImage.set(true);

    const pickedLocation: PlaceLocation = {
      lat: latitude,
      lng: longitude,
      address: null!,
      staticMapImageUrl: null!,
    };

    this.googleMapsService
      .getAddressStringByCoordinates(latitude, longitude)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address!;
          return of(
            this.googleMapsService.getMapImageByCoordinates(
              pickedLocation.lat,
              pickedLocation.lng,
              18
            )
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
  }
}
