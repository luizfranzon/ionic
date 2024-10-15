import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import { FeaturedHouseSkeletonComponent } from 'src/app/components/skeletons/featured-house-skeleton/featured-house-skeleton.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule,
    FeaturedHouseSkeletonComponent,
  ],
  declarations: [DiscoverPage],
})
export class DiscoverPageModule {}
