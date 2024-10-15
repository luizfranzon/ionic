import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonButton,
  IonLabel,
  IonIcon,
  IonImg,
  IonCardSubtitle,
  IonSkeletonText,
  IonThumbnail,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-featured-house-skeleton',
  templateUrl: './featured-house-skeleton.component.html',
  styleUrls: ['./featured-house-skeleton.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonCardSubtitle,
    IonImg,
    IonIcon,
    IonLabel,
    IonButton,
    IonText,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonThumbnail,
  ],
})
export class FeaturedHouseSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
