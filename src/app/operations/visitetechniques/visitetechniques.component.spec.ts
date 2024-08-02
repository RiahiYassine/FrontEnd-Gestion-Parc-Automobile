import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VISITETECHNIQUESComponent } from './visitetechniques.component';

describe('VISITETECHNIQUESComponent', () => {
  let component: VISITETECHNIQUESComponent;
  let fixture: ComponentFixture<VISITETECHNIQUESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VISITETECHNIQUESComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VISITETECHNIQUESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
