import { inject, Injectable, signal } from '@angular/core';
import { Booking } from '../models/booking.model';
import { AuthService } from './auth.service';

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

  private _bookings = signal<Booking[]>([
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle: 'Manhattan Mansion',
      guestQuantity: 2,
      placeImage: 'https://via.placeholder.com/300',
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
    console.log(data);
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
      dateFrom,
      dateTo
    );

    console.log(newBooking);

    this._bookings.update((bookings) => [...bookings, newBooking]);
  }
}
