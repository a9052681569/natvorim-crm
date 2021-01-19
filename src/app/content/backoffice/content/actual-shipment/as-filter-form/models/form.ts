import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';

export interface ASFilterFormState {
	data: ASFilterFormData;
	loadingState: LOADING_STATES;
}

export interface ASFilterFormData {
	shipmentDate: string;
	shipmentType: ASShipmentTypes;
}

export const AS_FILTER_FORM_INIT_STATE: ASFilterFormState = {
	data: {
		shipmentDate: '',
		shipmentType: ShipmentTypes.cdek,
	},
	loadingState: LOADING_STATES.default
};

export type ASShipmentTypes = ShipmentTypes | 'все';
