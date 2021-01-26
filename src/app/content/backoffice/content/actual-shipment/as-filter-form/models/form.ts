import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';

/**
 * состояние формы фильтров на странице отправки
 */
export interface ASFilterFormState {
	/**
	 * данные формы
	 */
	data: ASFilterFormData;
	/**
	 * состояние запроса на сервер
	 */
	loadingState: LOADING_STATES;
}

/**
 * данные формы фильтров на странице отправки
 */
export interface ASFilterFormData {
	/**
	 * дата отправки заказа. мм.дд.гггг
	 */
	shipmentDate: string;
	/**
	 * тип отправляемых заказов
	 */
	shipmentType: ASShipmentTypes;
	/**
	 * флаг, сообщающий о необходимости запросить только неотправленные заказы
	 */
	notSended: boolean;
}

/**
 * дефолтное состояние формы фильтров на странице отправки
 */
export const AS_FILTER_FORM_INIT_STATE: ASFilterFormState = {
	data: {
		shipmentDate: '',
		shipmentType: ShipmentTypes.cdek,
		notSended: true
	},
	loadingState: LOADING_STATES.default
};

/**
 * доступные типы отправки для формы фильтров на странице отправки
 */
export type ASShipmentTypes = ShipmentTypes | 'все';
