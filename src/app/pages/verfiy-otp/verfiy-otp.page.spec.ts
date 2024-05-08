import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerfiyOtpPage } from './verfiy-otp.page';

describe('VerfiyOtpPage', () => {
  let component: VerfiyOtpPage;
  let fixture: ComponentFixture<VerfiyOtpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerfiyOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
