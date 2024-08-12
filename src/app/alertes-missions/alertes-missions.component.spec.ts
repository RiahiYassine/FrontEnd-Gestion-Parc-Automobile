import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertesMissionsComponent } from './alertes-missions.component';

describe('AlertesMissionsComponent', () => {
  let component: AlertesMissionsComponent;
  let fixture: ComponentFixture<AlertesMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertesMissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertesMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
