/**
 * объект с информацией о клиенте
 */
export interface Person {
	/**
	 * уникальный идентификатор клиента
	 */
	id: number;
	/**
	 * ФИО клиента
	 */
	name: string;
	/**
	 * контакты клиента
	 */
	contacts: PersonContacts;
	/**
	 * адрес доставки клиенту
	 */
	address: string;
	/**
	 * массив id заказов пользователя
	 */
	ordersIds: number[];
}

export interface PersonContacts {
	/**
	 * электронная почта клиента
	 */
	email?: string;
	/**
	 * номер телефона
	 */
	phone?: string;
	/**
	 * аккаунт инстаграмм
	 */
	inst?: string;
}
