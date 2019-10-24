import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiAbmComponent } from './wiki-abm.component';

describe('WikiAbmComponent', () => {
  let component: WikiAbmComponent;
  let fixture: ComponentFixture<WikiAbmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiAbmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
