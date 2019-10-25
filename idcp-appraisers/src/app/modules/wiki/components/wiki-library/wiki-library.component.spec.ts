import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiLibraryComponent } from './wiki-library.component';

describe('WikiLibraryComponent', () => {
  let component: WikiLibraryComponent;
  let fixture: ComponentFixture<WikiLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
