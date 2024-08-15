import {Component, input, Input, OnDestroy} from '@angular/core';
import { Subscription, timer} from "rxjs";
import { DeviceService } from "../../device.service";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatListOption, MatSelectionList } from "@angular/material/list";
import { MatMiniFabButton } from "@angular/material/button";
import {
  EditorService,
  fadeTrigger,
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

  @Input() set deviceType(deviceType: string) {
    console.log("set deviceType", deviceType);
    if (this._deviceType === deviceType)
      return;
    this._deviceType = deviceType;
    this.updateDevices();
  }
  _deviceType: string | undefined;

  @Input() set company(company: string | undefined) {
    if (this._company === company)
      return;
    this._company = company;
    this.updateDevices();
  }
  _company: string | undefined;

  //set by deviceType
  root: NavigationItem | undefined;

  @Input() index: number = 2;

  list: Array<NavigationItem> | undefined;

  showSubmenu = "closed";

  device: NavigationItem | undefined;

  sliderSubscription: Subscription | undefined;

  constructor(
    private deviceService: DeviceService,
    private sliderService: SliderService,
    private editorService: EditorService,
    ) {
    this.sliderSubscription = this.sliderService.sliderNavigation(Sliders.NavSlider)?.subscribe({
      next: value => {
        // if (!value || !value.path) {
        //   this.clearDeviceDisplay();
        //   return;
        // }
        // const index = value.path.length;
        // if (index <= this.index) {
        //   this.clearDeviceDisplay();
        // }
      }
    })
  }

  ngOnDestroy(): void {
    this.sliderSubscription?.unsubscribe()
  }

  updateDevices() {
    if (!this._deviceType)
      return
    this.root = {name: this._deviceType, uid: this._deviceType, path: [
        {name: "device", pathElement: "device"}, {name: this._deviceType, pathElement: this._deviceType}
      ]}

    this.isLoadingResults = true;
    this.deviceService.getDeviceList(this._deviceType, this._company).subscribe({
      next: value => {
        this.list = value.map( (x: NavigationItem) => {
          return {
            name: x.name, uid: x.uid,
            path: x.path,
          }
        });
        this.isLoadingResults = false;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  navigate(item: NavigationItem) {
    console.log("navigating to device", item);
    this.sliderService.updateSliderNavigation(Sliders.NavSlider, item);
    this.device = item;
    this.showSubmenu = "open";
  }

  openEditor() {
    this.editorService.setEditor({id: "device", state: "open", options: {type: this._deviceType}})
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

  private clearDeviceDisplay() {
    this.showSubmenu = "closed";
    timer(300).subscribe({
      next: _ => {
        this.device = undefined;
      }
    })
  }

}
