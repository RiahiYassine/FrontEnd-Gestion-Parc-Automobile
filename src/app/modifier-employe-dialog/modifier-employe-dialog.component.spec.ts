import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEmployeDialogComponent } from './modifier-employe-dialog.component';

describe('ModifierEmployeDialogComponent', () => {
  let component: ModifierEmployeDialogComponent;
  let fixture: ComponentFixture<ModifierEmployeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierEmployeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierEmployeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
