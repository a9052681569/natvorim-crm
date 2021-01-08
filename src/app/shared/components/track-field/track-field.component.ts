import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { OrdersService } from 'src/app/content/backoffice/content/people/person/person-orders/orders.service';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { Order } from 'src/app/models/order';
import { ClipService } from '../../services/clip.service';

@Component({
	selector: 'ntv-track-field',
	templateUrl: './track-field.component.html',
	styleUrls: ['./track-field.component.scss']
})
export class TrackFieldComponent implements OnInit, OnDestroy {
	@Input() trackNumber: string;
	@Input() orderId: string;
	/**
	 * контрол отражает номер отправки (трек номер) заказа
	 */
	trackControl: FormControl;
	/**
	 * состояние загрузки для {@link trackControl}
	 */
	trackControlState: LOADING_STATES | null;

	/**
	 * список состояний загрузки
	 */
	controlStates = LOADING_STATES;

	/**
	 * маркер уничтожения компонента {@link PersonOrderComponent}
	 */
	destroyer$$ = new Subject();

	constructor(
		private fb: FormBuilder,
		private ordersService: OrdersService,
		public clipService: ClipService
	) { }

	ngOnInit(): void {
		this.trackControl = this.fb.control(this.trackNumber);

		// инициируем отслеживание изменений в контроле
		this.trackControlChangesHandler().subscribe();
	}

	ngOnDestroy(): void {
		this.destroyer$$.next();
		this.destroyer$$.complete();
	}

	/**
	 * обрабатывает изменения значения {@link trackControl}
	 */
	private trackControlChangesHandler(): Observable<unknown> {
		return this.trackControl.valueChanges
			.pipe(
				takeUntil(this.destroyer$$),
				tap(() => {
					this.trackControlState = this.controlStates.loading;
				}),
				debounceTime(500),
				switchMap((trackNumber: string) => {
					console.log(trackNumber);
					return this.ordersService.patchOrderTrack( this.orderId, trackNumber )
						.pipe(
							tap(() => {
								this.trackControlState = null;
							}),
							catchError(err => {

								this.trackControlState = this.controlStates.err;

								return err;
							})
						);
				})
			);
	}

}
