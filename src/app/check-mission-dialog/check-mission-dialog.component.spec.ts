import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMissionDialogComponent } from './check-mission-dialog.component';

describe('CheckMissionDialogComponent', () => {
  let component: CheckMissionDialogComponent;
  let fixture: ComponentFixture<CheckMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckMissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
