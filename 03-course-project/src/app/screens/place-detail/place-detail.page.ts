import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/components/create-booking/create-booking.component';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';

type BookingMode = 'select' | 'random';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  placeData = signal<Place | undefined>(undefined);

  navCtrl = inject(NavController);
  modalCtrl = inject(ModalController);
  placesService = inject(PlacesService);
  activatedRoute = inject(ActivatedRoute);
  actionSheetCtrl = inject(ActionSheetController);

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select date',
            handler: () => this.openBookingModal('select'),
          },
          {
            text: 'Random Date',
            handler: () => this.openBookingModal('random'),
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEL) => {
        actionSheetEL.present();
      });
  }

  openBookingModal(mode: BookingMode) {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.placeData },
        id: 'bookingModal',
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          console.log('BOOKED!');
        }

        if (resultData.role === 'cancel') {
          console.log('CANCELLED!');
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }

      const placeId = paramMap.get('placeId');
      const place = this.placesService.getPlaceById(placeId!);

      if (place && place.id) {
        this.placeData.set(place as Place);
      }
    });
  }
}
