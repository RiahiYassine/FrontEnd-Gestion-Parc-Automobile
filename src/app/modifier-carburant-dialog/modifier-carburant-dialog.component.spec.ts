import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCarburantDialogComponent } from './modifier-carburant-dialog.component';

describe('ModifierCarburantDialogComponent', () => {
  let component: ModifierCarburantDialogComponent;
  let fixture: ComponentFixture<ModifierCarburantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierCarburantDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierCarburantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
