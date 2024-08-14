import { Component } from '@angular/core';
import {AddDeviceSingleComponent} from "../add-device-single/add-device-single.component";
import {MatButton} from "@angular/material/button";
import {MatDialogActions} from "@angular/material/dialog";
import {EditorService} from "safecility-admin-services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeviceService} from "../../device.service";
import {ActivatedRoute, Router} from "@angular/router";

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
  valid: boolean
}

@Component({
  selector: 'lib-device-add-editor',
  standalone: true,
  imports: [
    AddDeviceSingleComponent,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './device-add-editor.component.html',
  styleUrl: './device-add-editor.component.css'
})
export class DeviceAddEditorComponent {

  data: DeviceData | undefined;
  valid: boolean = false;

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
      console.log("editor state", navigation.extras.state);
      this.deviceType = navigation.extras?.state?.['type'];
      this.companyUID = navigation.extras?.state?.['companyUID'];
    }
  }

  deviceEdited(c: DeviceUpdate | undefined) {
    this.data = c?.device;
    this.valid = !!c?.valid;
  }

  cancel() {
    this.editorService.closeEditor()
  }

  addDevice() {
    if (this.data)
      this.deviceService.addDevice(this.data).subscribe({
        next: value => {
          this.snackBar.open("added device", "", {duration: 3000})
          this.editorService.closeEditor()
        }
      })
  }
}
