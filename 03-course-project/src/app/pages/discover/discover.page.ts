import { Component, inject, OnInit, signal } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {
  placeServices = inject(PlacesService);

  loadedPlaces = signal(this.placeServices.places);

  ionViewWillEnter() {
    this.loadedPlaces.set(this.placeServices.places);
  }
}
