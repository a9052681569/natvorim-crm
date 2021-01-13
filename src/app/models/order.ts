import { OrderAges, OrderTypes, ShipmentTypes } from '../enums/order/order-enums';

/**
 * объект с информацией о заказе
 */
export interface Order {
	/**
	 * идентификатор заказа
	 */
	id: string;
	/**
	 * id клиентa, которому будет доставлен заказ
	 */
	personId: string;
	/**
	 * тип отправки (почта, курьер, сдек и т.д)
	 */
	shipmentType: ShipmentTypes | null;
	/**
	 * тип заказа (подписка, пробный и т.д)
	 */
	type: OrderTypes;
	/**
	 * состав заказа
	 */
	orderStructure: OrderStructure;
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
	/**
	 * номер почтового отправления
	 */
	trackNumber: string;
	/**
	 * маркер отправленности заказа
	 */
	sended: boolean;
}


/**
 * набор
 */
export interface Kit {
	/**
	 * возраст ребенка
	 */
	age: OrderAges | null;
	/**
	 * кол-во наборов для этого возраста
	 */
	count: number;
}

/**
 * структура заказа (что именно будет доставлено клиенту)
 */
export interface OrderStructure {
	/**
	 * наборы
	 */
	kits: Kit[];
	/**
	 * театры теней
	 */
	theatres: Kit[];
}
