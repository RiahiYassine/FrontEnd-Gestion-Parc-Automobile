import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDepartementDialogComponent } from './ajouter-departement-dialog.component';

describe('AjouterDepartementDialogComponent', () => {
  let component: AjouterDepartementDialogComponent;
  let fixture: ComponentFixture<AjouterDepartementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterDepartementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterDepartementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
