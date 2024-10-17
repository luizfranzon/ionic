/* eslint-disable no-prototype-builtins */
import { AuthService } from './auth.service';
import { Booking } from '../models/booking.model';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { inject, Injectable, signal } from '@angular/core';

interface CreateBookingData {
  placeId: string;
  placeTitle: string;
  guestQuantity: number;
  placeImage: string;
  firstName: string;
  lastName: string;
  dateFrom: Date;
  dateTo: Date;
}
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);

  private firebaseUrl =
    'https://ionic-course-45875-default-rtdb.firebaseio.com/';

  private _bookings = signal<Booking[]>([]);

  public $bookings = toObservable(this._bookings);

  get bookings() {
    return [...this._bookings()];
  }

  addBooking(data: CreateBookingData) {
    const {
      placeId,
      placeTitle,
      guestQuantity,
      placeImage,
      firstName,
      lastName,
      dateFrom,
      dateTo,
    } = data;

    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId!,
      placeTitle,
      guestQuantity,
      placeImage,
      firstName,
      lastName,
      new Date(dateFrom),
      new Date(dateTo)
    );

    this.httpClient
      .post(this.firebaseUrl + 'bookings.json', { ...newBooking })
      .subscribe(() => {
        this._bookings.update((bookings) => [...bookings, { ...newBooking }]);
      });
  }

  loadBookings() {
    return this.httpClient
      .get<{ [key: string]: Booking }>(
        this.firebaseUrl +
          'bookings.json?' +
          `orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .subscribe({
        next: (response) => {
          const loadedBookings = [];

          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              loadedBookings.push(
                new Booking(
                  key,
                  response[key].placeId,
                  response[key].userId,
                  response[key].placeTitle,
                  response[key].guestQuantity,
                  response[key].placeImage,
                  response[key].firstName,
                  response[key].lastName,
                  new Date(response[key].dateFrom),
                  new Date(response[key].dateTo)
                )
              );
            }
          }

          this._bookings.set(loadedBookings);
        },
      });
  }

  cancelBooking(bookingId: string) {
    this.removeBookingById(bookingId);
    this._bookings.update((bookings) =>
      bookings.filter((b) => b.id !== bookingId)
    );
  }

  removeBookingById(id: string) {
    this.httpClient
      .delete(this.firebaseUrl + `bookings/${id}.json`)
      .subscribe();
  }
}
