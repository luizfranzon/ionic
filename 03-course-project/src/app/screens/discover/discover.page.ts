import { Component, inject, signal } from '@angular/core';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { PlacesService } from 'src/app/services/places.service';
import { IonSegmentCustomEvent } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {
  placeServices = inject(PlacesService);
  menuCtrl = inject(MenuController);
  authService = inject(AuthService);

  loadedPlaces = signal(this.placeServices.places);
  relevantPlaces = signal(this.placeServices.places);

  ionViewWillEnter() {
    this.loadedPlaces.set(this.placeServices.places);
  }

  onFilterUpdate(event: IonSegmentCustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces.set(this.loadedPlaces());
    }

    if (event.detail.value === 'bookable') {
      this.relevantPlaces.set(
        this.loadedPlaces().filter(
          (p) => p.userId !== this.authService.userId()
        )
      );
    }
  }

  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }
}
