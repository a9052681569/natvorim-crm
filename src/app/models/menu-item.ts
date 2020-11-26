/**
 * элемент меню
 */
export interface MenuItem {
	/**
	 * путь на который переводит пункт меню
	 */
	route: string;
	/**
	 * имя иконки
	 * @example <mat-icon>{{MenuItem.iconName}}</mat-icon>
	 */
	iconName: string;
	/**
	 * название элемента меню
	 */
	itemName: string;
}
