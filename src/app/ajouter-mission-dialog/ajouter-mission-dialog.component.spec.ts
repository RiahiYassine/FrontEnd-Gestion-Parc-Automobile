import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterMissionDialogComponent } from './ajouter-mission-dialog.component';

describe('AjouterMissionDialogComponent', () => {
  let component: AjouterMissionDialogComponent;
  let fixture: ComponentFixture<AjouterMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterMissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
