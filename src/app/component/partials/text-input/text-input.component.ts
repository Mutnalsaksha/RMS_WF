// text-input.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  template: `
    <div class="form-group">
      <label>{{ label }}</label>
      <input [formControl]="control" [type]="controlName === 'address' ? 'textarea' : 'text'" class="form-control" />
    </div>
  `,
})
export class TextInputComponent {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() controlName: string = '';

  constructor() {}
}
