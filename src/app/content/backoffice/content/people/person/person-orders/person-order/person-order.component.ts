import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Order, OrderStructure } from 'src/app/models/order';
import { OrdersStore } from '../orders-store.service';
import { OrdersService } from '../orders.service';
import { LOADING_STATES } from 'src/app/enums/loading-states/loading-states';
import { OrderStructureDialogComponent } from './order-structure-dialog/order-structure-dialog.component';
import { EditOrderDialogComponent } from './edit-order-dialog/edit-order-dialog.component';
import { ClipService } from 'src/app/shared/services/clip.service';

@Component({
	selector: 'ntv-person-order',
	templateUrl: './person-order.component.html',
	styleUrls: ['./person-order.component.scss']
})
export class PersonOrderComponent {

	/**
	 * объект с информацией о заказе
	 */
	@Input() order: Order;

	constructor(
		private dialog: MatDialog,
		private readonly ordersStore: OrdersStore,
		public clipService: ClipService) { }

	/**
	 * Маркер сообщает нам, если у пользователя больше одного заказа.
	 *
	 * В таком случае меняется отрисовка {@link Order.orderStructure}
	 */
	get moreThanOneKit(): boolean {
		const kitsLenght = this.order.orderStructure.kits.length;
		const theatresLenght = this.order.orderStructure.theatres.length;

		return (kitsLenght > 1 || theatresLenght > 1) || (kitsLenght > 0 && theatresLenght > 0);
	}

	/**
	 * открывает диалог с инфорцией о наборах в заказе {@link OrderStructureDialogComponent}
	 */
	showOrderStructureDialog(): void {
		const data: {orderStructure: OrderStructure} = {
			orderStructure: this.order.orderStructure
		};

		this.dialog.open(OrderStructureDialogComponent, {data});
	}

	/**
	 * Открывает диалог с формой редактирования заказа {@link EditOrderDialogComponent}
	 *
	 * После закрытия диалога обновляем состояние стора т.к у диалога нет доступа к этому стору.
	 */
	showEditor(): void {
		const data = this.order;

		this.dialog.open(EditOrderDialogComponent, { data })
			.afterClosed()
			.subscribe((o: Order | null) => {
				if (o) {
					this.ordersStore.patchOrder(o);
				}
			});
	}

}
