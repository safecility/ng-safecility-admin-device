import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceMultipleComponent } from './add-device-multiple.component';

describe('AddDeviceMultipleComponent', () => {
  let component: AddDeviceMultipleComponent;
  let fixture: ComponentFixture<AddDeviceMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeviceMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeviceMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
