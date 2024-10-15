import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/components/create-booking/create-booking.component';
import { Place } from 'src/app/models/place.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  public placeData = signal<Place | undefined>(undefined);
  public isBookable = computed(() => {
    const userId = this.authService.userId();
    return userId !== this.placeData()?.userId;
  });

  private navCtrl = inject(NavController);
  private modalCtrl = inject(ModalController);
  private placesService = inject(PlacesService);
  private bookingService = inject(BookingService);
  private activatedRoute = inject(ActivatedRoute);
  private actionSheetCtrl = inject(ActionSheetController);
  private authService = inject(AuthService);

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select date',
            handler: () => this.openBookingModal(),
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

  openBookingModal() {
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
          this.bookingService.addBooking({
            ...resultData.data.bookingData,
            placeId: this.placeData()?.id,
            placeTitle: this.placeData()?.title,
            placeImage: this.placeData()?.imageUrl,
          });
        }

        if (resultData.role === 'cancel') {
          //
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
      this.placesService.getPlaceById(placeId!).subscribe((place) => {
        if (place) {
          this.placeData.set(place as Place);
        }
      });
    });
  }
}
