import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiIframeComponent } from './wiki-iframe.component';

describe('WikiIframeComponent', () => {
  let component: WikiIframeComponent;
  let fixture: ComponentFixture<WikiIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
