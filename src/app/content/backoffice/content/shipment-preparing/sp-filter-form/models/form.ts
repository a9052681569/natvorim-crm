import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { ShipmentOrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';

/**
 * состояние хранилища данных формы поиска заказов для подготовки отправки
 */
export interface SPFilterFormState {
	/**
	 * данные формы
	 */
	data: SPFilterFormData;
	/**
	 * состояние загрузки
	 */
	loadingState: LOADING_STATES | null;
}

/**
 * данные формы поиска заказов для подготовки отправки
 */
export interface SPFilterFormData {
	/**
	 * дата отправки заказа
	 */
	shipmentDate: string;
	/**
	 * тип отправляемого заказа
	 */
	shipmentType: ShipmentPreparingShipmentTypes;
	/**
	 * тип заказов
	 *
	 * @example 'сложный', 'театры', '2-3'
	 */
	ordersType: ShipmentPreparingOrderTypes;
	/**
	 * маркер необходимости получить только заказы без номера отправления
	 */
	noTrack: boolean;
}

export const SP_FILTER_FORM_INIT_STATE: SPFilterFormState = {
	data: {
		shipmentDate: '',
		shipmentType: ShipmentTypes.cdek,
		ordersType: ShipmentOrderTypes.twoThree,
		noTrack: false,
	},
	loadingState: null
};

/**
 * возможные типы отправляемого заказа для фильтров формы поиска в подготовке отправки
 */
export type ShipmentPreparingOrderTypes = ShipmentOrderTypes | 'все';

/**
 * возможные типы отправки заказов для фильтров формы поиска в подготовке отправки
 */
export type ShipmentPreparingShipmentTypes = ShipmentTypes | 'все';
