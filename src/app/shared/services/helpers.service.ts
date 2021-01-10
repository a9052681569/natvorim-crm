import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

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
}
