import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';

export interface FilterFormState {
	data: FilterFormData;
	loadingState: LOADING_STATES | null;
}

export interface FilterFormData {
	shipmentDate: Month;
	shipmentType: ShipmentTypes;
	ordersType: OrderAges | 'сложный';
}

export const filterFormInitialState: FilterFormState = {
	data: {
		shipmentDate: {
			name: '',
			date: ''
		},
		shipmentType: ShipmentTypes.cdek,
		ordersType: OrderAges.twoThree,
	},
	loadingState: null
};
