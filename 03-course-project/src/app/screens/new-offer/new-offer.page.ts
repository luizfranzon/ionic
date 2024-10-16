import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceLocation } from 'src/app/models/locations.model';
import { PlacesService } from 'src/app/services/places.service';

function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
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
    location: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required],
    }),
    image: new FormControl(null),
  });

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  onImagePicked(imageBase64: string | File) {
    let imageFile;
    if (typeof imageBase64 === 'string') {
      try {
        imageFile = base64toBlob(
          imageBase64.replace('data:image/jpeg,base64,', ''),
          'image/peg'
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      imageFile = imageBase64;
    }

    this.form.patchValue({ image: imageFile });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image')?.value) {
      return;
    }

    this.placesService.addPlace({
      ...this.form.value,
      availableFrom: new Date(this.form.value.dateFrom),
      availableTo: new Date(this.form.value.dateTo),
    });

    this.form.reset();
    this.router.navigateByUrl('/places/tabs/offers');
  }
}
