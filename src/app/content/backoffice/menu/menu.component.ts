import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../../models/menu-item';
import { menuToggleAnimation } from 'src/app/shared/animations';

@Component({
	selector: 'ntv-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
  	animations: [menuToggleAnimation]
})
export class MenuComponent {
	/**
	 * модель для шаблона элементов меню
	 */
	readonly navItems: MenuItem[] = [
		{
			route: 'dashboard',
			iconName: 'dashboard',
			itemName: 'Заказы'
		},
		{
			route: 'people',
			iconName: 'people',
			itemName: 'Люди'
		},
	];

	/**
	 * маркер состояния меню
	 */
	isOpened: boolean;

	constructor(private router: Router) {}

	/**
	 * открывает\закрывает меню
	 */
	toggleMenu(): void {
		this.isOpened = !this.isOpened;
	}
}
