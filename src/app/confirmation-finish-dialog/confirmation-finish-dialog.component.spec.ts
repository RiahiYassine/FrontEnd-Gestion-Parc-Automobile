import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationFinishDialogComponent } from './confirmation-finish-dialog.component';

describe('ConfirmationFinishDialogComponent', () => {
  let component: ConfirmationFinishDialogComponent;
  let fixture: ComponentFixture<ConfirmationFinishDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationFinishDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationFinishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
