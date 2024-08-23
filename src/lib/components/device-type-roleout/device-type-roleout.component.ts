import {Component, Input} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";

import {MatchNavigationItem, NavigationItem, SliderPanel, Sliders, SliderService} from "safecility-admin-services";
import {DeviceNavRoleoutComponent} from "../device-nav-roleout/device-nav-roleout.component";

@Component({
  selector: 'lib-device-type-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatListItem,
    MatListOption,
    MatSelectionList,
    DeviceNavRoleoutComponent
  ],
  templateUrl: './device-type-roleout.component.html',
  styleUrl: './device-type-roleout.component.css'
})
export class DeviceTypeRoleoutComponent implements SliderPanel {

  @Input() company: string | undefined;
  @Input() deviceTypes: Array<NavigationItem> = [
    {name:"power", uid:"power", path: [
        {name: "power", uid: "power"}
      ]}, {name:"dali", uid:"dali", path: [
        {name: "dali", uid: "dali"}
      ]}];

  @Input() set parent(parent: NavigationItem | undefined) {
    if (!parent || ! parent.path)
      return;
    const path = parent.path.map(x=>x).concat({name: "Device Type", uid: "device-type"})
    this.root = {name:"Device Type", uid:"device-type", path: path}

    this.deviceTypes = this.deviceTypes.map(d => {
      const devicePath = path.map(x => x).concat({name: d.name, uid: d.uid});
      return {name: d.name, uid: d.uid, path: devicePath}
    })
  }
  root: NavigationItem | undefined;

  selectedDeviceType: NavigationItem | undefined

  constructor(private sliderService: SliderService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: (value: NavigationItem | undefined) => {
        const match = MatchNavigationItem(value, this.root);
        if (match <=0)
          this.reset();
    }})
  }

  reset() {
    this.selectedDeviceType = undefined;
  }

  selectDeviceType(item: NavigationItem) {
    this.selectedDeviceType = item;
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
  }

}
