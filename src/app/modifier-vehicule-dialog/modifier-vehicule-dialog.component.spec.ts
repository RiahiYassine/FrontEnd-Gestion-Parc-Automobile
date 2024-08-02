import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierVehiculeDialogComponent } from './modifier-vehicule-dialog.component';

describe('ModifierVehiculeDialogComponent', () => {
  let component: ModifierVehiculeDialogComponent;
  let fixture: ComponentFixture<ModifierVehiculeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierVehiculeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierVehiculeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
