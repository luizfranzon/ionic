import { Component, inject, input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  modalCtrl = inject(ModalController);

  selectedPlace = input.required<Place>();

  onBookPlace() {
    this.modalCtrl.dismiss(null, 'confirm', 'bookingModal');
  }

  onCancel() {
    this.modalCtrl.dismiss(
      { message: 'test message' },
      'cancel',
      'bookingModal'
    );
  }

  ngOnInit() {}
}
