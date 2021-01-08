
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';
import { Order } from 'src/app/models/order';
import { Person } from 'src/app/models/people';

export interface SaveForm {
	orderType?: OrderTypes;
	onceOrder?: Order;
	customer?: Person;
	subscriptionsOrders?: Order[];
}

export interface SaveFormResponse {
	orderType: OrderTypes;
	onceOrder: Order;
	customer: Person;
	subscriptionsOrders: Order[];
}

export interface AddOrderFormState extends SaveFormResponse {
	loadingState: LOADING_STATES | null;
	resetForm: boolean;
}

export const ADD_ORDER_FORM_INITIAL_STATE: AddOrderFormState = {
	customer: {
		id: NaN,
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
	subscriptionsOrders: [],
	onceOrder: {
		id: 'NaN',
		personId: NaN,
		sended: false,
		shipmentDate: '',
		shipmentType: ShipmentTypes.post,
		trackNumber: '',
		type: OrderTypes.check,
		orderDate: '',
		orderStructure: {
			kits: [],
			theatres: []
		},
		comment: ''
	},
	orderType: OrderTypes.subscription,
	loadingState: null,
	resetForm: false
};
