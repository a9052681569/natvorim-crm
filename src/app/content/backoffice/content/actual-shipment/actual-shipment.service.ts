import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ASFilterFormData } from './as-filter-form/models/form';
import { ActualShipmentOrder, ASShipmentTypeState } from 'src/app/models/actual-shipment';
import { ChangeAllSendedData } from './models/change-all-sended';

@Injectable({
  providedIn: 'root'
})
export class ActualShipmentService {

	constructor(private http: HttpClient) { }

	/**
	 * запрашивает заказы для отправки, удовлетворяющие переданным критериям
	 *
	 * @param credentials критерии поиска
	 */
	search(credentials: ASFilterFormData): Observable<ASShipmentTypeState[]> {
		return this.http.post<ASShipmentTypeState[]>(environment.apiEndpoints.actualShipment, credentials);
	}

	/**
	 * делает запрос на изменение статуса отправленности у переданных заказов
	 *
	 * @param data данные для изменения статуса отправленности заказов
	 */
	sendedStatusChange(data: ChangeAllSendedData): Observable<ChangeAllSendedData> {
		return this.http.post<ChangeAllSendedData>(environment.apiEndpoints.actualShipmentPatchSended, { data });
	}
}
