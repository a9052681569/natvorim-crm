import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { CustomPreloadService } from './custom-preload.service';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducer, metaReducers } from 'src/app/store/index';
import { effects } from 'src/app/store/effects/index';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		SharedModule,
		MaterialModule,
		StoreModule.forRoot(reducer, {metaReducers}),
		!environment.production ? StoreDevtoolsModule.instrument() : [],
		StoreRouterConnectingModule.forRoot(),
		EffectsModule.forRoot(effects),
	],
	providers: [
		AuthGuard,
		CustomPreloadService,
		{provide: MAT_DATE_LOCALE, useValue: 'ru-ru'},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
