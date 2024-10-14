import { inject, Injectable, signal } from '@angular/core';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';

type CreatePlaceData = Omit<Place, 'id' | 'userId'>;
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private authService = inject(AuthService);

  private _places = signal<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://thumbs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg?w=1560&format=webp',
      149.99,
      new Date('2024-10-18'),
      new Date('2024-10-25'),
      '1'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgALSQU3N0NPf9GhQ_nbEpMl8WheAndi835g&s',
      189.99,
      new Date('2019-04-21'),
      new Date('2024-10-25'),
      '2'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Foggy_Day_Neuschwanstein_Castle_%28229936735%29.jpeg',
      99.99,
      new Date('2019-02-11'),
      new Date('2024-10-25'),
      '3'
    ),
  ]);

  get places() {
    return [...this._places()];
  }

  getPlaceById(id: string) {
    return { ...this._places().find((p) => p.id === id) };
  }

  addPlace(data: CreatePlaceData) {
    const { title, description, price, dateFrom, dateTo } = data;

    console.log('DEBUG - Adding place:', data);

    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Foggy_Day_Neuschwanstein_Castle_%28229936735%29.jpeg',
      price,
      new Date(dateFrom),
      new Date(dateTo),
      this.authService.userId()
    );

    this._places.update((places) => {
      return [...places, newPlace];
    });
  }
}
