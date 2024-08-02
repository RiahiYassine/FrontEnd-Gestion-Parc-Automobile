import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAssuranceDialogComponent } from './modifier-assurance-dialog.component';

describe('ModifierAssuranceDialogComponent', () => {
  let component: ModifierAssuranceDialogComponent;
  let fixture: ComponentFixture<ModifierAssuranceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierAssuranceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierAssuranceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
