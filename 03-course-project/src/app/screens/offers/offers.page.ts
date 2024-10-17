import { Component, computed, inject, signal } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage {
  private router = inject(Router);
  private placesService = inject(PlacesService);
  private authService = inject(AuthService);

  public isLoading = signal<boolean>(true);
  public skeletonArray = signal<number[]>(Array.from(Array(5).keys()));

  offers = computed<Place[]>(() => {
    return this.placesService.places.filter(
      (place) => place.userId === this.authService.userId
    );
  });

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
