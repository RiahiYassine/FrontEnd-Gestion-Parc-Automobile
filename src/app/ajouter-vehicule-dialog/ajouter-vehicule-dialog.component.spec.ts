import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterVehiculeDialogComponent } from './ajouter-vehicule-dialog.component';

describe('AjouterVehiculeDialogComponent', () => {
  let component: AjouterVehiculeDialogComponent;
  let fixture: ComponentFixture<AjouterVehiculeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterVehiculeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterVehiculeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
