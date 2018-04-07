import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sandbox2Component } from './sandbox2.component';

describe('Sandbox2Component', () => {
  let component: Sandbox2Component;
  let fixture: ComponentFixture<Sandbox2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sandbox2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sandbox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
