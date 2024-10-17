import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeoDataModel } from '../models/geo-data.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  httpClient = inject(HttpClient);

  public getAddressStringByCoordinates(
    lat: number,
    lng: number
  ): Observable<string | undefined> {
    return this.httpClient
      .get<GeoDataModel>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
      )
      .pipe(
        map((geoData: GeoDataModel) => {
          if (!geoData || !geoData.results) {
            return;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }

  public getMapImageByCoordinates(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`;
  }
}
