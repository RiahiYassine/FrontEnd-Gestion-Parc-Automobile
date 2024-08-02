import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDepartementComponent } from './mission-departement.component';

describe('MissionDepartementComponent', () => {
  let component: MissionDepartementComponent;
  let fixture: ComponentFixture<MissionDepartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionDepartementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDepartementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
