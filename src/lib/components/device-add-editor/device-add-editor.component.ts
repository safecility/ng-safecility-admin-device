import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions} from "@angular/material/dialog";
import {EditorService} from "safecility-admin-services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeviceService} from "../../device.service";
import {Router} from "@angular/router";
import {EditDeviceComponent} from "../edit-device/edit-device.component";
import {Device} from "../../device.model";

export interface Version {
  firmwareName: string
  firmwareVersion: string
}

export interface DeviceData {
  name: string,
  uid: string,
  tag: string,
  type: string,
  locationUid: string,
  companyUid: string,
  active: boolean,
  version: Version
  downlink: string,
}

export interface DeviceUpdate {
  device: DeviceData;
  update: boolean
  valid: boolean
}

@Component({
  selector: 'lib-device-add-editor',
  standalone: true,
  imports: [
    EditDeviceComponent,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './device-add-editor.component.html',
  styleUrl: './device-add-editor.component.css'
})
export class DeviceAddEditorComponent {

  editData: DeviceUpdate | undefined;
  valid: boolean = false;

  device: Device | undefined;
  companyUID: string | undefined;
  deviceType: string | undefined;

  constructor(
    private editorService: EditorService,
    private deviceService: DeviceService,
    private snackBar: MatSnackBar,
    router: Router,
  ) {
    const navigation = router.getCurrentNavigation();
    if (navigation) {
      this.device =     navigation.extras?.state?.['device'];
      this.deviceType = navigation.extras?.state?.['type'];
      this.companyUID = navigation.extras?.state?.['companyUID'];
    }
  }

  deviceEdited(du: DeviceUpdate | undefined) {
    this.editData = du;
  }

  cancel() {
    this.editorService.closeEditor()
  }

  addDevice() {
    if (!this.editData?.valid)
      return

    console.log("data update", this.editData.device);

    if (this.editData.update) {
      this.deviceService.updateDevice(this.editData.device).subscribe({
        next: value => {
          this.snackBar.open("updated device", "", {duration: 3000})
          this.editorService.closeEditor()
        }
      })
    } else {
      this.deviceService.addDevice(this.editData.device).subscribe({
        next: value => {
          this.snackBar.open("added device", "", {duration: 3000})
          this.editorService.closeEditor()
        }
      })
    }
  }
}
