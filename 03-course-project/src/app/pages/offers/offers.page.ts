import { Component, inject, OnInit, signal } from '@angular/core';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage {
  placesService = inject(PlacesService);

  offers = signal<Place[]>(this.placesService.places);
}
