import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterMissionDialogComponent } from './consulter-mission-dialog.component';

describe('ConsulterMissionDialogComponent', () => {
  let component: ConsulterMissionDialogComponent;
  let fixture: ComponentFixture<ConsulterMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsulterMissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
