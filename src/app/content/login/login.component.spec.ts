import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {

  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;


  beforeEach( async () => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [provideMockStore({initialState: {}})]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test form validate err', () => {
    const nameField: DebugElement = fixture.debugElement.query(By.css('input[name="username"]'));
    nameField.triggerEventHandler('input', {target: {value: 'andrew!'}});
    const passwordField: DebugElement = fixture.debugElement.query(By.css('input[name="password"]'));
    passwordField.triggerEventHandler('input', {target: {value: 'bioware9'}});

    fixture.detectChanges();
    const submit: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));

    expect(submit.nativeElement.disabled).toBeTruthy();
  });
});
