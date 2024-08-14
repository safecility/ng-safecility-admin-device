import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavigationItem, EditAction} from "safecility-admin-services";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatMiniFabButton} from "@angular/material/button";

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
export class DeviceRoleoutComponent {

  @Input() index: number = 3;

  @Input() device: NavigationItem | undefined;

  @Output() deviceChanged = new EventEmitter<EditAction>();

  archiveDevice() {
    this.deviceChanged.emit({action: "archive", item: this.device})
  }

}
