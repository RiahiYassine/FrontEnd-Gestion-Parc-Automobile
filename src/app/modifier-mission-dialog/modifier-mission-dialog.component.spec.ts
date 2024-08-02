import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMissionDialogComponent } from './modifier-mission-dialog.component';

describe('ModifierMissionDialogComponent', () => {
  let component: ModifierMissionDialogComponent;
  let fixture: ComponentFixture<ModifierMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierMissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
