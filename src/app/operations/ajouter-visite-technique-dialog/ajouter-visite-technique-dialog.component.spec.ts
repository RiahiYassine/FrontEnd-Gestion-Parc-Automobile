import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterVisiteTechniqueDialogComponent } from './ajouter-visite-technique-dialog.component';

describe('AjouterVisiteTechniqueDialogComponent', () => {
  let component: AjouterVisiteTechniqueDialogComponent;
  let fixture: ComponentFixture<AjouterVisiteTechniqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterVisiteTechniqueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterVisiteTechniqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
