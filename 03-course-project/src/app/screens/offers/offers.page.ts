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
  private placesService = inject(PlacesService);
  private router = inject(Router);

  public isLoading = signal<boolean>(false);
  public skeletonArray = signal<number[]>(Array.from(Array(5).keys()));

  offers = signal<Place[]>(this.placesService.places);

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', id]);
  }

  ionViewWillEnter() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.offers.set(this.placesService.places);
      this.isLoading.set(false);
    }, Math.random() * 1500);
  }
}
