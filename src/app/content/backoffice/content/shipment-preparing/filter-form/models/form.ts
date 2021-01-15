import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';

export interface FilterFormState {
	data: FilterFormData;
	loadingState: LOADING_STATES | null;
}

export interface FilterFormData {
	shipmentDate: string;
	shipmentType: ShipmentPreparingShipmentTypes;
	ordersType: ShipmentPreparingOrderTypes;
	noTrack: boolean;
}

export const filterFormInitialState: FilterFormState = {
	data: {
		shipmentDate: '',
		shipmentType: ShipmentTypes.cdek,
		ordersType: OrderAges.twoThree,
		noTrack: false,
	},
	loadingState: null
};

export type ShipmentPreparingOrderTypes = OrderAges | 'сложный' | 'театры' | 'все';

export type ShipmentPreparingShipmentTypes = ShipmentTypes | 'все';
