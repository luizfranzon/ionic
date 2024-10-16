import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import { DatetimePickerComponent } from 'src/app/components/datetime-picker/datetime-picker.component';
import { LocationPickerComponent } from 'src/app/components/location-picker/location-picker.component';
import { MapModalComponent } from 'src/app/components/map-modal/map-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NewOfferPageRoutingModule,
    LocationPickerComponent,
    MapModalComponent,
  ],
  declarations: [NewOfferPage, DatetimePickerComponent],
})
export class NewOfferPageModule {}
