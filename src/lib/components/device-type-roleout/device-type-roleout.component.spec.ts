import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeRoleoutComponent } from './device-type-roleout.component';

describe('DeviceTypeRoleoutComponent', () => {
  let component: DeviceTypeRoleoutComponent;
  let fixture: ComponentFixture<DeviceTypeRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTypeRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTypeRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
