import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterMaintenanceDialogComponent } from './ajouter-maintenance-dialog.component';

describe('AjouterMaintenanceDialogComponent', () => {
  let component: AjouterMaintenanceDialogComponent;
  let fixture: ComponentFixture<AjouterMaintenanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterMaintenanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
