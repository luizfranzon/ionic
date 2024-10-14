import { Component, input } from '@angular/core';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
})
export class DatetimePickerComponent {
  fieldLabel = input.required<string>();
  formControlName = input.required<string>();
  minDate = input<string>();
  maxDate = input<string>();
  placeholder = input<string>();
  dateDisplayFormat = input<string>();
}
