import { Component, computed, inject, signal } from '@angular/core';
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

  public isLoading = signal<boolean>(true);
  public skeletonArray = signal<number[]>(Array.from(Array(5).keys()));

  offers = computed<Place[]>(() => this.placesService.places);

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', id]);
  }

  ionViewWillEnter() {
    this.placesService.fetchPlaces();

    this.placesService.$places.subscribe(() => {
      this.isLoading.set(false);
    });
  }
}
