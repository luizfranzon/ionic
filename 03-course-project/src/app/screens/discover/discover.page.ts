import { Component, inject, signal } from '@angular/core';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { PlacesService } from 'src/app/services/places.service';
import { IonSegmentCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {
  placeServices = inject(PlacesService);
  menuCtrl = inject(MenuController);

  loadedPlaces = signal(this.placeServices.places);

  ionViewWillEnter() {
    this.loadedPlaces.set(this.placeServices.places);
  }

  onFilterUpdate(event: IonSegmentCustomEvent<SegmentChangeEventDetail>) {
    //
  }

  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }
}
