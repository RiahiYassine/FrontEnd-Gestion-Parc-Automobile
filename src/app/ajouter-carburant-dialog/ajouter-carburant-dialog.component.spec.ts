import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCarburantDialogComponent } from './ajouter-carburant-dialog.component';

describe('AjouterCarburantDialogComponent', () => {
  let component: AjouterCarburantDialogComponent;
  let fixture: ComponentFixture<AjouterCarburantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterCarburantDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterCarburantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
