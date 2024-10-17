import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

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
export class ImagePickerComponent implements OnInit {
  platformService = inject(Platform);

  selectedImage = signal<string | undefined>(undefined);
  usePicker = signal<boolean>(false);

  imagePick = output<string | File>();

  filePicker = viewChild<ElementRef<HTMLInputElement>>('filePicker');

  constructor() {
    addIcons({ MapIcon });
  }

  ngOnInit(): void {
    if (
      (this.platformService.is('mobile') &&
        !this.platformService.is('hybrid')) ||
      this.platformService.is('desktop')
    ) {
      this.usePicker.set(true);
    }
  }

  public async onPickImage() {
    if (this.usePicker()) {
      this.filePicker()?.nativeElement.click();
      return;
    }

    await Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        this.selectedImage.set(image.base64String!);
        this.imagePick.emit(image.base64String!);
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  onFileChosen(event: Event) {
    let pickedFile: File | undefined = undefined;
    const fileReader = new FileReader();
    if (event != null) {
      const inputElement = event.target as HTMLInputElement;

      if (inputElement.files && inputElement.files.length > 0) {
        pickedFile = inputElement.files[0];

        fileReader.onload = () => {
          const dataUrl = fileReader.result?.toString();
          this.selectedImage.set(dataUrl);
          this.imagePick.emit(pickedFile!);
        };
        fileReader.readAsDataURL(pickedFile);
      }
    }

    if (pickedFile !== undefined) {
      return;
    }
  }
}
