import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiManagerComponent } from './wiki-manager.component';

describe('WikiManagerComponent', () => {
  let component: WikiManagerComponent;
  let fixture: ComponentFixture<WikiManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
