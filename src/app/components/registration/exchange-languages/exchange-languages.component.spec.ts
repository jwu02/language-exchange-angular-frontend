import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeLanguagesComponent } from './exchange-languages.component';

describe('ExchangeLanguagesComponent', () => {
  let component: ExchangeLanguagesComponent;
  let fixture: ComponentFixture<ExchangeLanguagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeLanguagesComponent]
    });
    fixture = TestBed.createComponent(ExchangeLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
