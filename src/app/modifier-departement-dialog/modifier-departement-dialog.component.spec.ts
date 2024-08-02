import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDepartementDialogComponent } from './modifier-departement-dialog.component';

describe('ModifierDepartementDialogComponent', () => {
  let component: ModifierDepartementDialogComponent;
  let fixture: ComponentFixture<ModifierDepartementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierDepartementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierDepartementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
