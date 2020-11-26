import { Action, createAction, props } from '@ngrx/store';
import { type } from 'os';
import { Order } from '../../models/order';
import { CustomersState } from '../reducers/costomers.reducer';

export interface AddOrdersPendingProps {
	personId: number;
}

export interface AddOrdersSuccessProps {
	orders: Order[];
}



export enum OrdersActionsNames {
	ADD_ORDERS_PENDING = '[Orders] ADD_ORDERS_PENDING',
	ADD_ORDERS_SUCCESS = '[Orders] ADD_ORDERS_SUCCESS',
	ADD_ORDERS_ERROR = '[Orders] ADD_ORDERS_ERROR'
}

export const OrdersActions = {
	addOrdersPending: createAction(OrdersActionsNames.ADD_ORDERS_PENDING, props<AddOrdersPendingProps>()),
	addOrdersSuccess: createAction(OrdersActionsNames.ADD_ORDERS_SUCCESS, props<AddOrdersSuccessProps>()),
	addOrdersError: createAction(OrdersActionsNames.ADD_ORDERS_ERROR),
};

