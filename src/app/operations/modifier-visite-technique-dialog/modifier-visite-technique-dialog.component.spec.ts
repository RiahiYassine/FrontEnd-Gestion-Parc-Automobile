import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierVisiteTechniqueDialogComponent } from './modifier-visite-technique-dialog.component';

describe('ModifierVisiteTechniqueDialogComponent', () => {
  let component: ModifierVisiteTechniqueDialogComponent;
  let fixture: ComponentFixture<ModifierVisiteTechniqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierVisiteTechniqueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierVisiteTechniqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
