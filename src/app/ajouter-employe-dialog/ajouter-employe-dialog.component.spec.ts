import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEmployeDialogComponent } from './ajouter-employe-dialog.component';

describe('AjouterEmployeDialogComponent', () => {
  let component: AjouterEmployeDialogComponent;
  let fixture: ComponentFixture<AjouterEmployeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterEmployeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterEmployeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
