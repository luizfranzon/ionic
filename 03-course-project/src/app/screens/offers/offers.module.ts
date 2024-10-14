import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { OfferItemComponent } from 'src/app/components/offer-item/offer-item.component';
import { OfferItemSkeletonComponent } from 'src/app/components/skeletons/offer-item-skeleton/offer-item-skeleton.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OffersPageRoutingModule],
  declarations: [OffersPage, OfferItemComponent, OfferItemSkeletonComponent],
})
export class OffersPageModule {}
