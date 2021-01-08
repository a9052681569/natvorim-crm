import { PersonAddress } from './people';

export interface ShipmentPreparingOrder {
	id: string;
	name: string;
	address: PersonAddress;
	phone: string;
	trackNumber: string;
	sended: boolean;
}
