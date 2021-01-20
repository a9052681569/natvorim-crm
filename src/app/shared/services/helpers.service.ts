import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  	providedIn: 'root'
})
export class HelpersService {

  	/**
	   * приводит контрол к точному типу. В целом это грязных хак, обманывающий тайпскрипт, но как сделать по другому не придумал
	   *
	   * @param control результат метода {@link FormGroup.get()}
	   * @returns инстанс контрола
	   */
	getControl(control: AbstractControl | null): FormControl {
		return control as FormControl;
	}

	phoneValidator(control: AbstractControl): ValidationErrors | null {
		const val: string = control.value ? control.value as string : '';

		if (val) {

			const onlyDigits = val.replace(/\D/g, '');

			let withoutCountryCode: string;

			if (onlyDigits.startsWith('7') || onlyDigits.startsWith('8')) {
				withoutCountryCode = onlyDigits.slice(1);
			} else {
				withoutCountryCode = onlyDigits;
			}

			if (val !== withoutCountryCode) {
				control.patchValue(withoutCountryCode);
			}

		}

		return null;
	}

	addRussianPhonePrefix(phone: string): string {
		return phone.startsWith('9') ? `+7${phone}` : phone;
	}
}
