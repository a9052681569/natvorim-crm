import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Month } from 'src/app/enums/months/months';
import { OrderAges, ShipmentTypes } from 'src/app/enums/order/order-enums';

export interface FilterFormState {
	data: FilterFormData;
	loadingState: LOADING_STATES | null;
}

export interface FilterFormData {
	shipmentDate: string;
	shipmentType: ShipmentTypes;
	ordersType: ShipmentPreparingOrderTypes;
	otherCriteria: ShipmentPreparingOtherCriteriaInterface;
	othersArr: ShipmentPreparingOtherCriteriaEnum[];
}

export const filterFormInitialState: FilterFormState = {
	data: {
		shipmentDate: '',
		shipmentType: ShipmentTypes.cdek,
		ordersType: OrderAges.twoThree,
		otherCriteria: {
			all: false,
			notSendedYet: false
		},
		othersArr: []
	},
	loadingState: null
};

export interface ShipmentPreparingOtherCriteriaInterface {
	all: boolean;
	notSendedYet: boolean;
}

export type ShipmentPreparingOrderTypes = OrderAges | 'сложный' | 'театры';

export enum ShipmentPreparingOtherCriteriaEnum {
	all = 'все типы',
	notSendedYet = 'не отправленные'
}
