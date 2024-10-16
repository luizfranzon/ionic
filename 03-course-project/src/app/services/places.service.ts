/* eslint-disable no-prototype-builtins */
import { inject, Injectable, signal } from '@angular/core';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';

type CreatePlaceData = Omit<Place, 'id' | 'userId'>;
interface UpdatePlaceData {
  title: string;
  description: string;
}
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);

  private firebaseUrl =
    'https://ionic-course-45875-default-rtdb.firebaseio.com/';

  private _places = signal<Place[]>([]);

  public $places = toObservable(this._places);

  get places() {
    return [...this._places()];
  }

  public fetchPlaces() {
    this.httpClient
      .get<{ [key: string]: Place }>(`${this.firebaseUrl}/offered-places.json`)
      .subscribe((response) => {
        const loadedPlaces = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            loadedPlaces.push(
              new Place(
                key,
                response[key].title,
                response[key].description,
                response[key].imageUrl,
                response[key].price,
                response[key].dateFrom,
                response[key].dateTo,
                response[key].userId,
                response[key].location
              )
            );
          }
        }

        this._places.set(loadedPlaces);
      });
  }

  getPlaceById(id: string) {
    return this.httpClient.get(`${this.firebaseUrl}/offered-places/${id}.json`);
  }

  addPlace(data: CreatePlaceData) {
    const { title, description, price, dateFrom, dateTo, location } = data;

    const newPlace = new Place(
      Math.floor(Math.random() * 1000).toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Foggy_Day_Neuschwanstein_Castle_%28229936735%29.jpeg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId(),
      location
    );

    this.httpClient
      .post<{ name: string }>(
        `${this.firebaseUrl}/offered-places.json`,
        newPlace
      )
      .subscribe((response) => {
        this._places.update((places) => {
          return [...places, { ...newPlace, id: response.name }];
        });
      });
  }

  updatePlaceById(id: string, data: UpdatePlaceData) {
    this._places.update((places) => {
      const placeIndex = places.findIndex((p) => p.id === id);
      if (placeIndex === -1) {
        return places;
      }

      const updatedPlace = { ...places[placeIndex], ...data };

      this.httpClient
        .put(`${this.firebaseUrl}/offered-places/${id}.json`, updatedPlace)
        .subscribe(() => {
          this._places.update((places) => {
            const placeIndex = places.findIndex((p) => p.id === id);
            if (placeIndex === -1) {
              return places;
            }

            const updatedPlace = { ...places[placeIndex], ...data };
            const updatedPlaces = [...places];
            updatedPlaces[placeIndex] = updatedPlace;

            return updatedPlaces;
          });
        });

      const updatedPlaces = [...places];
      updatedPlaces[placeIndex] = updatedPlace;

      return updatedPlaces;
    });
  }
}
