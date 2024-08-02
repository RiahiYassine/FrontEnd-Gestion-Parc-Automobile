import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarChefComponent } from './side-bar-chef.component';

describe('SideBarChefComponent', () => {
  let component: SideBarChefComponent;
  let fixture: ComponentFixture<SideBarChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideBarChefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
