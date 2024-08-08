import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeAlerteDialogComponent } from './add-type-alerte-dialog.component';

describe('AddTypeAlerteDialogComponent', () => {
  let component: AddTypeAlerteDialogComponent;
  let fixture: ComponentFixture<AddTypeAlerteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTypeAlerteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeAlerteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
