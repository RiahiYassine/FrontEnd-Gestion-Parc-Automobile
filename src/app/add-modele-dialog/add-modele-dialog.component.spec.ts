import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeleDialogComponent } from './add-modele-dialog.component';

describe('AddModeleDialogComponent', () => {
  let component: AddModeleDialogComponent;
  let fixture: ComponentFixture<AddModeleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModeleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModeleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
