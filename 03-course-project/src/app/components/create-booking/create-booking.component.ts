import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  todayDate = signal<string>(new Date().toISOString());

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      lastName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      guestQuantity: new FormControl('1', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      dateFrom: new FormControl(this.verifyIfDateFromIsBeforeToday(), {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(this.verifyIfDateFromIsBeforeToday(), {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  onBookPlace() {
    this.modalCtrl.dismiss(
      { bookingData: this.form.value },
      'confirm',
      'bookingModal'
    );
  }

  verifyIfDateToIsAfterDateFrom() {
    const dateFrom = new Date(this.form.value.dateFrom);
    const dateTo = new Date(this.form.value.dateTo);

    if (dateTo <= dateFrom) {
      this.form.get('dateTo')?.setValue(dateFrom.toISOString());
    }
  }

  verifyIfDateFromIsBeforeToday() {
    const dateFrom = new Date(this.selectedPlace().dateFrom);
    const today = new Date(this.todayDate());

    if (dateFrom < today) {
      return today.toISOString();
    }

    return dateFrom.toISOString();
  }

  onCancel() {
    this.modalCtrl.dismiss(
      { message: 'test message' },
      'cancel',
      'bookingModal'
    );
  }
}
