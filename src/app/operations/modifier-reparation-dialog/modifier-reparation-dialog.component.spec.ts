import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierReparationDialogComponent } from './modifier-reparation-dialog.component';

describe('ModifierReparationDialogComponent', () => {
  let component: ModifierReparationDialogComponent;
  let fixture: ComponentFixture<ModifierReparationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierReparationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierReparationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
