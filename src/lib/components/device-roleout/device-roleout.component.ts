import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavigationItem, EditAction, SliderPanel, Resource} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatMiniFabButton} from "@angular/material/button";
import {DeviceService} from "../../device.service";
import {Device} from "../../device.model";

@Component({
  selector: 'lib-device-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    MatMenuTrigger
  ],
  templateUrl: './device-roleout.component.html',
  styleUrl: './device-roleout.component.css'
})
export class DeviceRoleoutComponent implements SliderPanel {

  @Input() parent: NavigationItem | undefined;

  @Input() set selectedDevice(device: NavigationItem | undefined) {
    this.getDevice(device)

    if (!device) {
      this.root = undefined
      return
    }
    let path: Array<Resource> = [];
    if (this.parent && this.parent.path) {
      path = this.parent.path.map(x => x).concat({name: device.name, uid: device.uid})
    }
    else {
      path = [{name: "/", uid: "/"},
        {name: "device", uid: "device"}, {name: device.name, uid: device.uid}
      ]
    }
    console.log("setting device roleout", path);
    this.root = {name: device.name, uid: device.uid, path}
  }
  device: Device | undefined;
  errors: any;
  root: NavigationItem | undefined;
  loading: boolean = true;

  @Output() deviceChanged = new EventEmitter<EditAction>();

  constructor(private deviceService: DeviceService) {
  }

  getDevice(device: NavigationItem | undefined) {
    this.device = device
    if (!device) {
      return
    }
    this.loading = true;
    this.deviceService.getDevice(device.uid).subscribe({
      next: value => {
        this.loading = false;
        if (!value) {
          this.errors = {loading: "false", message: "not found"};
          return;
        }
        this.errors = undefined;
        this.device = value;
      },
      error: err => {
        console.error(err)
      }
    })
  }

  //emit because we want to return to the list and update it
  archiveDevice() {
    this.deviceChanged.emit({action: "archive", item: this.device})
  }

}
