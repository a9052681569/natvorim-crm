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
	address: PersonAddress;
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
