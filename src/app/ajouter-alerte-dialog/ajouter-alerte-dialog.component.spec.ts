import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAlerteDialogComponent } from './ajouter-alerte-dialog.component';

describe('AjouterAlerteDialogComponent', () => {
  let component: AjouterAlerteDialogComponent;
  let fixture: ComponentFixture<AjouterAlerteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterAlerteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterAlerteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
