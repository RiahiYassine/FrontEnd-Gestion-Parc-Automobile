import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterReparationDialogComponent } from './ajouter-reparation-dialog.component';

describe('AjouterReparationDialogComponent', () => {
  let component: AjouterReparationDialogComponent;
  let fixture: ComponentFixture<AjouterReparationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterReparationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterReparationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
