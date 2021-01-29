/**
 * объект с информацией о клиенте
 */
export interface Person {
	/**
	 * уникальный идентификатор клиента
	 */
	id: string;
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
	address: PersonAddress;
	/**
	 * массив напоминаний о продлении сотрудничества
	 */
	reminders: Reminder[];
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

export interface PersonAddress {
	city: string;
	address: string;
}

/**
 * информация о продлении сотрудничества
 */
export interface Reminder {
	/**
	 * дата напоминания
	 */
	date: string;
	/**
	 * маркер отправленности напоминания
	 */
	sended: boolean;
	/**
	 * маркер продления сотрудничества
	 */
	didNewOrder: boolean;
}
