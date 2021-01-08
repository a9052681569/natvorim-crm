import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { OrdersService } from 'src/app/content/backoffice/content/people/person/person-orders/orders.service';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'ntv-sended-checkbox',
  templateUrl: './sended-checkbox.component.html',
  styleUrls: ['./sended-checkbox.component.scss']
})
export class SendedCheckboxComponent implements OnInit {

	@Input() sendedStatus: boolean;
	@Input() orderId: string;

	/**
	 * список состояний загрузки
	 */
	controlStates = LOADING_STATES;
	/**
	 * контрол отражает отправлен ли заказ
	 */
	sendMarkerControl: FormControl;
	/**
	 * состояние загрузки для {@link sendMarkerControl}
	 */
	sendMarkerControlState: LOADING_STATES | null;
	/**
	 * поток с состоянием {@link sendMarkerControl} нужен чтобы точно контролировать состояние контрола
	 */
	sendMarkerControlValueChanger = new Subject<boolean>();

	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private ordersService: OrdersService
	) { }

	ngOnInit(): void {
		// инициируем контрол
		this.sendMarkerControl = this.fb.control(this.sendedStatus);

		// инициируем отслеживание изменений в контролe
		this.sendMarkerControlChangesHandler().subscribe();
	}

	/**
	 * обрабатывает изменения значения {@link sendMarkerControl}
	 */
	private sendMarkerControlChangesHandler(): Observable<unknown> {
		return this.sendMarkerControlValueChanger
			.pipe(
				takeUntil(this.destroyer$$),
				tap(() => {
					this.sendMarkerControlState = this.controlStates.loading;
				}),
				debounceTime(500),
				switchMap((sended: boolean) => {
					return this.ordersService.patchOrderSended( this.orderId, sended)
						.pipe(
							tap((v: boolean) => {

								this.sendMarkerControl.setValue(v);

								this.sendMarkerControlState = null;
							}),
							catchError(err => {

								this.sendMarkerControlState = this.controlStates.err;

								return err;
							})
						);
				})
			);
	}
	/**
	 * обертка чтобы прокидывать значения в {@link sendMarkerControlValueChanger} из шаблона
	 */
	changeSended(sended: boolean): void {
		this.sendMarkerControlValueChanger.next(sended);
	}

}
