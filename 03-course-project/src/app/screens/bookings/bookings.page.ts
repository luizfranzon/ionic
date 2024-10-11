import { Component, inject, OnInit, signal } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookingsService = inject(BookingService);

  loadedBookings = signal(this.bookingsService.bookings);

  onCancelBooking(bookingId: string, slidingBookingEL: IonItemSliding) {
    slidingBookingEL.close();
  }

  ngOnInit() {}
}
