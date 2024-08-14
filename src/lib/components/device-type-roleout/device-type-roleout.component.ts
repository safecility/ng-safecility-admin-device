import {Component, Input} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatListItem, MatListOption, MatSelectionList} from "@angular/material/list";

import {NavigationItem, SliderPanel, Sliders, SliderService} from "safecility-admin-services";
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

  @Input() deviceTypes: Array<NavigationItem> = [
    {name:"power", uid:"power", path: [
        {name: "device", pathElement: "device"}, {name: "power", pathElement: "power"}
      ]}, {name:"dali", uid:"dali", path: [
        {name: "device", pathElement: "device"}, {name: "dali", pathElement: "dali"}
      ]}];

  @Input() index = 1;

  nav: NavigationItem | undefined

  constructor(private sliderService: SliderService,
  ) {
    this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: (change: NavigationItem | undefined) => {
        if (change && change.path) {
          console.log("path change", change.path.length);
          if (change.path.length <= this.index) {
            this.nav = undefined;
            return;
          }
          else if (change.path.length !== this.index + 1)
            return;
          }
        if (!this.nav || !change || (change.uid !== this.nav.uid)) {
          this.nav = change;
        }
      }
    })
  }

  typeChange(item: NavigationItem) {
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
  }

}
