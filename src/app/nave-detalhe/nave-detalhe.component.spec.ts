import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaveDetalheComponent } from './nave-detalhe.component';

describe('NaveDetalheComponent', () => {
  let component: NaveDetalheComponent;
  let fixture: ComponentFixture<NaveDetalheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NaveDetalheComponent]
    });
    fixture = TestBed.createComponent(NaveDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
