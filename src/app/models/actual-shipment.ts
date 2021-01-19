import { ShipmentOrderTypes, ShipmentTypes } from '../enums/order/order-enums';
import { OrderStructure } from './order';
import { PersonAddress } from './people';

export interface ASShipmentTypeState {
	shipmentType: ShipmentTypes;
	ordersByType: ASOrderTypeState[];
}

export interface ASOrderTypeState {
	ordersType: ShipmentOrderTypes;
	orders: ActualShipmentOrder[];
}

export interface ActualShipmentOrder {
	name: string;
	orderStructure: OrderStructure;
	comment: string;
	address: PersonAddress;
	orderId: string;
	sended: boolean;
}

