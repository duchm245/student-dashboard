import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClazzDialogComponent } from './select-clazz-dialog.component';

describe('SelectClazzDialogComponent', () => {
  let component: SelectClazzDialogComponent;
  let fixture: ComponentFixture<SelectClazzDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectClazzDialogComponent]
    });
    fixture = TestBed.createComponent(SelectClazzDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
