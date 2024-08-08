import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAlerteDialogComponent } from './modifier-alerte-dialog.component';

describe('ModifierAlerteDialogComponent', () => {
  let component: ModifierAlerteDialogComponent;
  let fixture: ComponentFixture<ModifierAlerteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierAlerteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierAlerteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
