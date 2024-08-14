import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAddEditorComponent } from './device-add-editor.component';

describe('DeviceAddEditorComponent', () => {
  let component: DeviceAddEditorComponent;
  let fixture: ComponentFixture<DeviceAddEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceAddEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceAddEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
