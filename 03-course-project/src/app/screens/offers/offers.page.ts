import { Component, inject, signal } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage {
  placesService = inject(PlacesService);
  router = inject(Router);

  offers = signal<Place[]>(this.placesService.places);

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', id]);
  }

  ionViewWillEnter() {
    this.offers.set(this.placesService.places);
  }
}
