import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarqueDialogComponent } from './add-marque-dialog.component';

describe('AddMarqueDialogComponent', () => {
  let component: AddMarqueDialogComponent;
  let fixture: ComponentFixture<AddMarqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMarqueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMarqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
