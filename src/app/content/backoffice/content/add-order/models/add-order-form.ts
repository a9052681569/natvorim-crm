
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';

export interface SaveForm {
	orderType?: OrderTypes;
	onceOrder?: AddOrderFormOnceOrder;
	customer?: AddOrderFormCustomer;
	subscriptionsOrders?: AddOrderFormSubscriptionsOrders;
}

export interface SaveFormResponse {
	orderType: OrderTypes;
	onceOrder: AddOrderFormOnceOrder;
	customer: AddOrderFormCustomer;
	subscriptionsOrders: AddOrderFormSubscriptionsOrders;
}

export interface AddOrderFormState extends SaveFormResponse {
	loadingState: LOADING_STATES | null;
	resetForm: boolean;
}

export interface AddOrderFormCustomer {
	customer: Person;
	isValid: boolean;
}
export interface AddOrderFormOnceOrder {
	order: Order;
	isValid: boolean;
}
export interface AddOrderFormSubscriptionsOrders {
	orders: Order[];
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
		isValid: false
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
