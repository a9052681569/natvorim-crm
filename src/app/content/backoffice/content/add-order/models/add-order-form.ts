
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order, OrderStructure } from 'src/app/models/order';
import { Person } from 'src/app/models/people';

/**
 * Данные, передаваемые одной из форм добавления заказа.
 *
 * Копирует {@link SaveFormResponse}, но не имеет обязательных полей,
 * т.к заранее не извесно какую именно часть данных мы сохраняем.
 */
export interface SaveForm {
	/**
	 * тип заказа
	 */
	orderType?: OrderTypes;
	/**
	 * информация о форме добавления пробного заказа {@link OnceFormComponent}
	 */
	onceOrder?: AddOrderFormOnceOrder;
	/**
	 * информация о форме добаления покупателя {@link CustomerFormComponent}
	 */
	customer?: AddOrderFormCustomer;
	/**
	 * информация о форме добаления подписки {@link SubscriptionOrdersFormComponent}
	 */
	subscriptionsOrders?: AddOrderFormSubscriptionsOrders;
}

/**
 * Данные всех форм добавления заказа.
 *
 * Копирует {@link SaveForm}, но все поля обязательны,
 * т.к. это объект, который мы получаем в ответ на запрос данных формы.
 */
export interface SaveFormResponse {
	/**
	 * тип заказа
	 */
	orderType: OrderTypes;
	/**
	 * информация о форме добавления пробного заказа {@link OnceFormComponent}
	 */
	onceOrder: AddOrderFormOnceOrder;
	/**
	 * информация о форме добавления покупателя {@link CustomerFormComponent}
	 */
	customer: AddOrderFormCustomer;
	/**
	 * информация о форме добавления подписки {@link SubscriptionOrdersFormComponent}
	 */
	subscriptionsOrders: AddOrderFormSubscriptionsOrders;
}

/**
 * состояние хранилища данных форм добавления заказа
 */
export interface AddOrderFormState extends SaveFormResponse {
	/**
	 * статус загрузки
	 */
	loadingState: LOADING_STATES | null;
	/**
	 * триггер для сброса всех форм
	 */
	resetForm: boolean;
}

/**
 * информация о форме добаления покупателя {@link CustomerFormComponent}
 */
export interface AddOrderFormCustomer {
	/**
	 * информация о покупателе
	 */
	customer: Person;
	/**
	 * маркер валидности формы добаления покупателя
	 */
	isValid: boolean;
}

/**
 * информация о форме добавления пробного заказа {@link OnceFormComponent}
 */
export interface AddOrderFormOnceOrder {
	/**
	 * информация о заказе
	 */
	order: Order;
	/**
	 * маркер валидности формы
	 */
	isValid: boolean;
}
export interface AddOrderFormSubscriptionsOrders {
	/**
	 * массив заказов
	 */
	orders: Order[];
	/**
	 * структура заказов в подписке
	 */
	subscriptionOrderStructure: OrderStructure;
	/**
	 * маркер валидности формы
	 */
	isValid: boolean;
}

export const ADD_ORDER_FORM_INITIAL_STATE: AddOrderFormState = {
	customer: {
		customer: {
			id: 'NaN',
			name: '',
			contacts: {
				email: '',
				inst: '',
				phone: ''
			},
			address: {
				city: '',
				address: ''
			}
		},
		isValid: false
	},
	subscriptionsOrders: {
		orders: [],
		isValid: false,
		subscriptionOrderStructure: {
			theatres: [],
			kits: []
		}
	},
	onceOrder: {
		order: {
			id: 'NaN',
			personId: 'NaN',
			sended: false,
			shipmentDate: '',
			shipmentType: null,
			trackNumber: '',
			type: OrderTypes.check,
			orderDate: '',
			orderStructure: {
				kits: [],
				theatres: []
			},
			comment: ''
		},
		isValid: false
	},
	orderType: OrderTypes.subscription,
	loadingState: null,
	resetForm: false
};
