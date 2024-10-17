import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mapOutline } from 'ionicons/icons';
import { CreateBookingComponent } from 'src/app/components/create-booking/create-booking.component';
import { MapModalComponent } from 'src/app/components/map-modal/map-modal.component';
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
    const userId = this.authService.userId;
    return userId !== this.placeData()?.userId;
  });

  private navCtrl = inject(NavController);
  private modalCtrl = inject(ModalController);
  private placesService = inject(PlacesService);
  private bookingService = inject(BookingService);
  private activatedRoute = inject(ActivatedRoute);
  private actionSheetCtrl = inject(ActionSheetController);
  private authService = inject(AuthService);

  constructor() {
    addIcons({ mapOutline });
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
        componentProps: { selectedPlace: this.placeData() },
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

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          isSelectable: false,
          closeButtonText: 'Close',
          modalTitle: 'Place',
          center: {
            lat: this.placeData()?.location.lat,
            lng: this.placeData()?.location.lng,
          },
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
