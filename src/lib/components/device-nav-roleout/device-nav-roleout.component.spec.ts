import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceNavRoleoutComponent } from './device-nav-roleout.component';

describe('DeviceNavRoleoutComponent', () => {
  let component: DeviceNavRoleoutComponent;
  let fixture: ComponentFixture<DeviceNavRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceNavRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceNavRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
