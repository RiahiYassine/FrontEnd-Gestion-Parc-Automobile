import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraiterDialogComponent } from './traiter-dialog.component';

describe('TraiterDialogComponent', () => {
  let component: TraiterDialogComponent;
  let fixture: ComponentFixture<TraiterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraiterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraiterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
