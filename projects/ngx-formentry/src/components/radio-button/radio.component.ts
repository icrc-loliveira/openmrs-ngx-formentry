import {
  Component,
  Input,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ofe-radio-button',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonControlComponent),
      multi: true
    }
  ]
})
export class RadioButtonControlComponent
  implements ControlValueAccessor, OnInit, OnChanges {
  @Input() public id: String;
  @Input() public options: Array<any>;
  @Input() public selected: any;
  @Input() public allowUnselect: boolean;
  @Input() public orientation: string;

  private _value: any = undefined;

  public ngOnInit() {
    this.options = this.options.map((opt) => ({ ...opt, checked: false }));
    this.updateSelectedOption();
  }

  public writeValue(value: any) {
    this.value = value;
    const newValueOpt = this.options.find((opt) => opt.value === value);
    if (newValueOpt) {
      Object.assign(newValueOpt, { checked: true });
    }
  }

  public registerOnChange(
    fn: (newValue?: any, emitModelEvent?: boolean) => void
  ) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  get value(): any {
    return this._value ?? '';
  }

  set value(value: any) {
    this._value = value;
  }

  public handleClick(option) {
    if (this.allowUnselect && option.checked) {
      option.checked = false;
      // doesn't fire by itself, so we create a synthetic change event
      this.handleChange(option);
    } else if (!option.checked) {
      option.checked = true;
    }
  }

  public handleChange(option) {
    if (!option.checked) {
      this.value = undefined;
    } else {
      this.value = option.value;
    }

    this.onChange(this.value);
  }

  public onChange = (args) => {};
  public onTouched = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected) {
      this.updateSelectedOption();
    }
  }

  private updateSelectedOption(): void {
    if (this.selected) {
      const maybeOpt = this.options.find((opt) => opt.value === this.selected);
      if (maybeOpt) {
        this.options.forEach((opt) => (opt.checked = opt === maybeOpt));
        this.value = this.selected;
      }
    }
  }
}
