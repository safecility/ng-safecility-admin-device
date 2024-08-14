import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRoleoutComponent } from './device-roleout.component';

describe('DeviceRoleoutComponent', () => {
  let component: DeviceRoleoutComponent;
  let fixture: ComponentFixture<DeviceRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
