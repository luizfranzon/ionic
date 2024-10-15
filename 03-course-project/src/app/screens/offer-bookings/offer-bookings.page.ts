import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OffersBookingsPage implements OnInit {
  route = inject(ActivatedRoute);
  navCtrl = inject(NavController);
  placesService = inject(PlacesService);
  isLoading = signal<boolean>(true);

  placeData = signal<Place | undefined>(undefined);

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      const placeId = paramMap.get('placeId');
      this.placesService.getPlaceById(placeId!).subscribe((place) => {
        if (place) {
          this.placeData.set(place as Place);
          this.isLoading.set(false);
        }
      });
    });
  }
}
