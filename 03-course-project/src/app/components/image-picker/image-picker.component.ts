import { Component, output, signal } from '@angular/core';
import {
  IonButton,
  IonImg,
  IonIcon,
  IonLabel,
  IonThumbnail,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map as MapIcon } from 'ionicons/icons';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonLabel,
    IonIcon,
    IonImg,
    IonButton,
    IonThumbnail,
  ],
})
export class ImagePickerComponent {
  selectedImage = signal<Photo | null>(null);

  imagePick = output<string>();

  constructor() {
    addIcons({ MapIcon });
  }

  public async onPickImage() {
    await Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        this.selectedImage.set(image);
        this.imagePick.emit(image.base64String!);
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
