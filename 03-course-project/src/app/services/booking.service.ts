import { inject, Injectable, signal } from '@angular/core';
import { Booking } from '../models/booking.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

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
    'https://ionic-course-45875-default-rtdb.firebaseio.com/bookings.json';

  private _bookings = signal<Booking[]>([
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle: 'Manhattan Mansion',
      guestQuantity: 2,
      placeImage: 'https://placehold.co/300x300',
      firstName: 'Max',
      lastName: 'Schwarz',
      dateFrom: new Date('2019-01-01'),
      dateTo: new Date('2019-01-05'),
    },
  ]);

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
      this.authService.userId(),
      placeTitle,
      guestQuantity,
      placeImage,
      firstName,
      lastName,
      new Date(dateFrom),
      new Date(dateTo)
    );

    this.httpClient.post(this.firebaseUrl, { ...newBooking }).subscribe(() => {
      this._bookings.update((bookings) => [...bookings, { ...newBooking }]);
    });
  }

  cancelBooking(bookingId: string) {
    this._bookings.update((bookings) =>
      bookings.filter((b) => b.id !== bookingId)
    );
  }
}
