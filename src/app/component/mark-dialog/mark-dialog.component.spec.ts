import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkDialogComponent } from './mark-dialog.component';

describe('MarkDialogComponent', () => {
  let component: MarkDialogComponent;
  let fixture: ComponentFixture<MarkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkDialogComponent]
    });
    fixture = TestBed.createComponent(MarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
