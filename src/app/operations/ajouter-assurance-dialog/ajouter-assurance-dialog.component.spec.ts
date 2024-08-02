import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAssuranceDialogComponent } from './ajouter-assurance-dialog.component';

describe('AjouterAssuranceDialogComponent', () => {
  let component: AjouterAssuranceDialogComponent;
  let fixture: ComponentFixture<AjouterAssuranceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterAssuranceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterAssuranceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
