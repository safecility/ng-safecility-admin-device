import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, map, timer, of, delay} from "rxjs";

import { NavigationItem } from "safecility-admin-services";

const sourceDevices = [{name: "Safecility Dali 1", uid: "aa24kf88as7", deviceType: 'dali', path: [
    {name: "device", pathElement: "device"}, {name: "dali", pathElement: "type"}, {name: "Safecility Dali 1", pathElement: "aa24kf88as7"}
  ]},
  {name: "Big Dali 1", uid: "aa24kf88as8", deviceType: 'dali', path: [
      {name: "device", pathElement: "device"}, {name: "dali", pathElement: "type"}, {name: "Big Dali 1", pathElement: "aa24kf88as8"}
    ] },
  {name: "Small Dali 1", uid: "aa24kf88as9", deviceType: 'dali', path:  [
      {name: "device", pathElement: "device"}, {name: "dali", pathElement: "type"}, {name: "Small Dali 1", pathElement: "aa24kf88as79"}
    ]},
  {name: "Safe Power 1", uid: "oa24kf88as7", deviceType: 'power', path: [
      {name: "device", pathElement: "device"}, {name: "power", pathElement: "type"}, {name: "Safe Power 1", pathElement: "oa24kf88as7"}
    ]},
  {name: "Big Power 1", uid: "oa24kf88as8", deviceType: 'power', path: [
      {name: "device", pathElement: "device"}, {name: "power", pathElement: "type"}, {name: "Big Power 1", pathElement: "oa24kf88as8"}
    ] },
  {name: "Small Power 1", uid: "oa24kf88as9", deviceType: 'power', path:  [
      {name: "device", pathElement: "device"}, {name: "power", pathElement: "type"}, {name: "Small Power 1", pathElement: "oa24kf88as9"}
    ]},
]

interface typedNavigationItem extends NavigationItem {
  deviceType: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  devices = new BehaviorSubject<Array<typedNavigationItem>>(sourceDevices)

  constructor() { }

  getDeviceList(deviceType: string, company?: string) : Observable<Array<NavigationItem>> {
    return this.devices.pipe(map( (a) => {
      if (!a)
        return []
      return a.filter(u => !!u).filter(x => !x || x.deviceType === deviceType) as Array<NavigationItem>
    }))
  }

  addDevice(device: any): Observable<boolean> {
    return of(true)
  }

  archiveDevice(uid: string) {
    return timer(200).pipe(map(_ => {
      this.devices.next(this.devices.value.filter(x => x.uid !== uid));
      return true
    }))
  }

  uidExists(uid: string): Observable<boolean> {
    return of(this.devices.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

}
