import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserCredentials } from 'src/app/models/user';
import { RootState } from 'src/app/store';
import { AuthActions } from 'src/app/store/actions/auth.actions';
import { LoginService } from './login.service';

@Component({
  selector: 'ntv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

	constructor(private store: Store<RootState>) { }

	auth(credentials: UserCredentials): void {
		this.store.dispatch(AuthActions.loginPending({ credentials }));
	}
}
