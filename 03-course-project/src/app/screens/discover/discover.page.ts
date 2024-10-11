import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PlacesService } from 'src/app/services/places.service';

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

  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }
}
