import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryProfilePage } from './category-profile.page';

describe('CategoryProfilePage', () => {
  let component: CategoryProfilePage;
  let fixture: ComponentFixture<CategoryProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CategoryProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
