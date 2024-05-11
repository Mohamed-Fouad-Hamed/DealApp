import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerfiyResetPasswordOtpPage } from './verfiy-reset-password-otp.page';

describe('VerfiyResetPasswordOtpPage', () => {
  let component: VerfiyResetPasswordOtpPage;
  let fixture: ComponentFixture<VerfiyResetPasswordOtpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerfiyResetPasswordOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
