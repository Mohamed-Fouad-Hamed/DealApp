import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountProfilePage } from './account-profile.page';

describe('AccountProfilePage', () => {
  let component: AccountProfilePage;
  let fixture: ComponentFixture<AccountProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccountProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
