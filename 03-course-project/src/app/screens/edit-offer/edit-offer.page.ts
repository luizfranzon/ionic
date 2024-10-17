import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  router = inject(Router);
  navCtrl = inject(NavController);
  placesService = inject(PlacesService);
  activatedRoute = inject(ActivatedRoute);

  placeData = signal<Place | undefined>(undefined);
  placeId = signal<string | null>(null);

  form!: FormGroup;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.router.navigateByUrl('/places/tabs/offers');
        return;
      }

      this.placeId.set(paramMap.get('placeId'));
      this.placesService.getPlaceById(this.placeId()!).subscribe(
        (place) => {
          if (place) {
            console.log('getPlace', place);
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
          } else {
            this.returnPage();
          }
        },
        (error) => {
          console.error(error);
          this.returnPage();
        }
      );
    });
  }

  returnPage() {
    this.router.navigateByUrl('/places/tabs/offers');
  }

  onUpdateOffer() {
    if (this.form && !this.form?.valid) {
      return;
    }

    const place = this.placeData();
    if (place && place.id) {
      const { title, description } = this.form.value;
      this.placesService.updatePlaceById(this.placeId()!, {
        title,
        description,
      });

      this.router.navigateByUrl('/places/tabs/offers');
    }
  }
}
