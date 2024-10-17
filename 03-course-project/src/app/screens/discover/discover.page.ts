import { Place } from 'src/app/models/place.model';
import { IonSegmentCustomEvent } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { PlacesService } from 'src/app/services/places.service';
import { Component, computed, inject, signal } from '@angular/core';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {
  placeServices = inject(PlacesService);
  menuCtrl = inject(MenuController);
  authService = inject(AuthService);

  filterType = signal<'all' | 'bookable'>('all');
  loadedPlaces = computed(() => this.placeServices.places);
  relevantPlaces = computed(() => {
    return this.loadedPlaces().filter(
      (p) => p.userId !== this.authService.userId
    );
  });
  showData = signal<Place[]>(this.loadedPlaces());
  isLoading = signal<boolean>(true);

  ionViewWillEnter() {
    this.isLoading.set(true);
    this.placeServices.fetchPlaces();
    this.placeServices.$places.subscribe(() => {
      if (this.filterType() === 'all') {
        this.showData.set(this.loadedPlaces());
        this.isLoading.set(false);
      } else {
        this.showData.set(this.relevantPlaces());
        this.isLoading.set(false);
      }
    });
  }

  onFilterUpdate(event: IonSegmentCustomEvent<SegmentChangeEventDetail>) {
    this.isLoading.set(true);
    if (event.detail.value === 'all') {
      this.filterType.set('all');
      this.placeServices.fetchPlaces();
      this.showData.set(this.loadedPlaces());
    }

    if (event.detail.value === 'bookable') {
      this.filterType.set('bookable');
      this.placeServices.fetchPlaces();
      this.showData.set(this.relevantPlaces());
    }

    this.isLoading.set(false);
  }
}
