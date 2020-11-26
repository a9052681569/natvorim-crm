import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

	constructor(private snack: MatSnackBar) { }

	clip(val: string | number): void {
		navigator.clipboard.writeText(val.toString())
			.then(() => {
				this.snack.open('Скопировано в буфер обмена', undefined, {duration: 2000});
			})
			.catch(err => {
				this.snack.open('Ошибка при кпировании в буфер обмена', undefined, {duration: 2000});
			});
	}
}
