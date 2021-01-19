import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { OrderAges, ShipmentOrderTypes, ShipmentTypes } from 'src/app/enums/order/order-enums';

export interface SPFilterFormState {
	data: SPFilterFormData;
	loadingState: LOADING_STATES | null;
}

export interface SPFilterFormData {
	shipmentDate: string;
	shipmentType: ShipmentPreparingShipmentTypes;
	ordersType: ShipmentPreparingOrderTypes;
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

export type ShipmentPreparingOrderTypes = ShipmentOrderTypes | 'все';

export type ShipmentPreparingShipmentTypes = ShipmentTypes | 'все';
