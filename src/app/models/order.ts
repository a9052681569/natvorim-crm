export interface Order {
	/**
	 * идентификатор заказа
	 */
	id: number;
	/**
	 * id клиентa, которому будет доставлен заказ
	 */
	personId: number;
	/**
	 * адрес доставки, указывается при отличии от адреса клиента
	 */
	address?: string;
	/**
	 * тип отправки (почта, курьер, сдек и т.д)
	 */
	shipmentType: ShipmentTypes;
	/**
	 * тип заказа (подписка, пробный и т.д)
	 */
	type: OrderTypes;
	/**
	 * набор дополнительных опций (например добавить театр теней)
	 */
	extraOptions: ExtraOptions;
	/**
	 * массив наборов в заказе
	 */
	kits: Kit[];
	/**
	 * комментарий к заказу
	 */
	comment: string;
	/**
	 * дата предполагаемой отправки заказа. ISOString
	 */
	shipmentDate: string;
	/**
	 * дата совершения заказа. ISOString
	 */
	orderDate: string;
}

export interface ExtraOptions {
	theatre: boolean;
}

export enum ShipmentTypes {
	cdek = 'сдэк',
	post = 'почта',
	courier = 'курьер'
}

export enum OrderTypes {
	check = 'пробный',
	subscription = 'подписка',
}

export enum OrderAges {
	twoThree = '2-3',
	fourSix = '4-6',
	sevenNine = '7-9'
}

export interface Kit {
	age: OrderAges;
	count: number;
}
