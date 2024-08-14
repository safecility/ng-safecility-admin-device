import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceSingleComponent } from './add-device-single.component';

describe('AddDeviceSingleComponent', () => {
  let component: AddDeviceSingleComponent;
  let fixture: ComponentFixture<AddDeviceSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeviceSingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeviceSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
