import { createAction, props } from '@ngrx/store';
import { User, UserCredentials } from '../../models/user';

export interface LoginPendingProps {
	credentials: UserCredentials;
}

export interface LoginSuccessProps {
	user: User;
}
/**
 * перечисление названий экшенов
 */
export enum AuthActionsNames {
	LOGIN_PENDING = '[Auth] LOGIN_PENDING',
	LOGIN_SUCCESS = '[Auth] LOGIN_SUCCESS',
	LOGIN_ERROR = '[Auth] LOGIN_ERROR',
	LOGIN_END = '[Auth] LOGIN_END'
}

export const AuthActions = {
	loginPending: createAction(AuthActionsNames.LOGIN_PENDING, props<LoginPendingProps>()),
	loginSuccess: createAction(AuthActionsNames.LOGIN_SUCCESS, props<LoginSuccessProps>()),
	loginError: createAction(AuthActionsNames.LOGIN_ERROR),
	loginEnd: createAction(AuthActionsNames.LOGIN_END)
};

