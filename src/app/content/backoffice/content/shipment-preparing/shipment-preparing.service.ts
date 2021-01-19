import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SPFilterFormData } from './sp-filter-form/models/form';
import { ShipmentPreparingOrder } from 'src/app/models/shipment-preparing-order';
import { environment } from 'src/environments/environment';

@Injectable({
  	providedIn: 'root'
})
export class ShipmentPreparingService {

	constructor(private http: HttpClient) { }

	search(credentials: SPFilterFormData): Observable<ShipmentPreparingOrder[]> {
		return this.http.post<ShipmentPreparingOrder[]>(environment.apiEndpoints.prepairingOrders, credentials);
	}
}
