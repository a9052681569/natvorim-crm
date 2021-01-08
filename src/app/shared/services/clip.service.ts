import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

	constructor(private snack: MatSnackBar) { }

	clip(val: string | number | undefined): void {
		if (val === undefined) { return; }
		if (val) {
			this.snack.open('Скопировано в буфер обмена', undefined, {duration: 2000});
		} else {
			this.snack.open('Копируем пустое значение', undefined, {duration: 2000});
		}
	}
}
