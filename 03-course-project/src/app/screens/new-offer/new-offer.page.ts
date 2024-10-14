import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage {
  private placesService = inject(PlacesService);
  private router = inject(Router);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required],
    }),
    description: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required, Validators.maxLength(180)],
    }),
    price: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required, Validators.min(1)],
    }),
    dateFrom: new FormControl(new Date().toISOString(), {
      updateOn: 'change',
      validators: [Validators.required],
    }),
    dateTo: new FormControl(new Date().toISOString(), {
      updateOn: 'change',
      validators: [Validators.required],
    }),
  });

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form.value);

    this.placesService.addPlace({
      ...this.form.value,
      availableFrom: new Date(this.form.value.dateFrom),
      availableTo: new Date(this.form.value.dateTo),
    });

    this.form.reset();
    this.router.navigateByUrl('/places/tabs/offers');
  }
}
