import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavesComponent } from './naves.component';

describe('NavesComponent', () => {
  let component: NavesComponent;
  let fixture: ComponentFixture<NavesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavesComponent]
    });
    fixture = TestBed.createComponent(NavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
