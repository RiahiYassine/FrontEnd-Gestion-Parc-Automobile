import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMaintenanceDialogComponent } from './modifier-maintenance-dialog.component';

describe('ModifierMaintenanceDialogComponent', () => {
  let component: ModifierMaintenanceDialogComponent;
  let fixture: ComponentFixture<ModifierMaintenanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierMaintenanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
