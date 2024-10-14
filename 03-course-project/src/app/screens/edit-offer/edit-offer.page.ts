import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  placeData = signal<Place | undefined>(undefined);

  form!: FormGroup;

  route = inject(ActivatedRoute);
  placesService = inject(PlacesService);
  navCtrl = inject(NavController);

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      const placeId = paramMap.get('placeId');
      const place = this.placesService.getPlaceById(placeId!);

      if (place && place.id) {
        this.placeData.set(place as Place);

        this.form = new FormGroup({
          title: new FormControl(this.placeData()?.title, {
            updateOn: 'change',
            validators: [Validators.required],
          }),
          description: new FormControl(this.placeData()?.description, {
            updateOn: 'change',
            validators: [Validators.required, Validators.maxLength(180)],
          }),
        });
      }
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
  }
}
