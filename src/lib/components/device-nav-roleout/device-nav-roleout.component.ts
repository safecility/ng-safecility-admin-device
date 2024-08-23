import { Component, Input, OnDestroy} from '@angular/core';
import { Subscription, timer} from "rxjs";
import { DeviceService } from "../../device.service";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatListOption, MatSelectionList } from "@angular/material/list";
import { MatMiniFabButton } from "@angular/material/button";
import {
  fadeTrigger, MatchNavigationItem,
  Resource,
  EditorService,
  NavigationItem,
  SliderPanel,
  Sliders,
  SliderService
} from "safecility-admin-services";
import { DeviceRoleoutComponent} from "../device-roleout/device-roleout.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@Component({
  selector: 'lib-device-nav-roleout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatListItem,
    MatListOption,
    MatMiniFabButton,
    MatSelectionList,
    DeviceRoleoutComponent,
    MatProgressSpinner,
  ],
  templateUrl: './device-nav-roleout.component.html',
  styleUrl: './device-nav-roleout.component.css',
  animations: [fadeTrigger],
})
export class DeviceNavRoleoutComponent implements SliderPanel, OnDestroy {

  isLoadingResults: boolean = true;

  @Input() parent: NavigationItem | undefined

  @Input() company: string | undefined;

  @Input() set setDeviceType(deviceType: string) {
    console.log("set deviceType", deviceType);
    if (this.deviceType === deviceType)
      return;
    this.deviceType = deviceType;
    let path: Array<Resource> = [];
    if (this.parent && this.parent.path) {
      path = this.parent.path.map(x => x).concat({name: this.deviceType, uid: this.deviceType})
    }
    else {
      path = [{name: "/", uid: "/"},
        {name: "device", uid: "device"}, {name: this.deviceType, uid: this.deviceType}
      ]
    }
    console.log("device nav root", path);
    this.root = {name: this.deviceType, uid: this.deviceType, path}
    this.updateDevices();
  }
  deviceType: string | undefined;

  //set by deviceType
  root: NavigationItem | undefined;

  showSubmenu = "closed";

  deviceOptions: Array<NavigationItem> | undefined;

  selectedDevice: NavigationItem | undefined;

  sliderSubscription: Subscription | undefined;

  constructor(
    private deviceService: DeviceService,
    private sliderService: SliderService,
    private editorService: EditorService,
    ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        const match = MatchNavigationItem(value, this.root);
        if (match <=0)
          this.reset();
      }
    })
  }

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe()
  }

  updateDevices() {
    if (!this.deviceType)
      return

    this.isLoadingResults = true;
    this.deviceService.getDeviceList(this.deviceType, this.company).subscribe({
      next: value => {
        this.deviceOptions = value.map( (x: NavigationItem) => {
          let path: Array<Resource> = []
          if (!this.root || !this.root.path) {
            console.warn("we need root to setup slider navigation");
          }
          else {
            path = this.root.path.map(x => x).concat({name: x.name, uid: x.uid});
          }
          return {
            name: x.name, uid: x.uid,
            path,
          }
        });
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.isLoadingResults = false;
      }
    })
  }

  selectDevice(item: NavigationItem) {
    this.selectedDevice = item;
    console.log("navigating to device", item);
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.showSubmenu = "open";
  }

  openEditor() {
    this.editorService.setEditor({id: "device", state: "open", options: {type: this.deviceType}})
  }

  deviceChanged($event: any) {
    if (!$event.item)
      return;
    if ($event.action === 'archive') {
      this.deviceService.archiveDevice($event.item?.uid).subscribe({
        next: _ => {
          this.isLoadingResults = false;
          this.sliderService.updateSliderNavigation(Sliders.NavSlider, this.root);
        },
        error: err => {
          console.error(err);
        }
      })
    }
  }

  private reset() {
    this.showSubmenu = "closed";
    timer(300).subscribe({
      next: _ => {
        this.selectedDevice = undefined;
      }
    })
  }

}
