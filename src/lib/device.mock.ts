import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, timer, map, of, delay} from "rxjs";

import { NavigationItem } from "safecility-admin-services";
import {Device} from "./device.model";

export const deviceList = [{name: "Safecility Dali 1", uid: "aa24kf88as7", company: 'safecility', deviceType: 'dali', path: [
    {name: "device", uid: "device"}, {name: "dali", uid: "type"}, {name: "Safecility Dali 1", uid: "aa24kf88as7"}
  ]},
  {name: "Big Dali 1", uid: "aa24kf88as8", company: 'big-corp', deviceType: 'dali', path: [
      {name: "device", uid: "device"}, {name: "dali", uid: "type"}, {name: "Big Dali 1", uid: "aa24kf88as8"}
    ] },
  {name: "Small Dali 1", uid: "aa24kf88as9", company: 'small-corp', deviceType: 'dali', path:  [
      {name: "device", uid: "device"}, {name: "dali", uid: "type"}, {name: "Small Dali 1", uid: "aa24kf88as79"}
    ]},
  {name: "Mock Dali 1", uid: "aa24kf88as0", company: 'mock-corp', deviceType: 'dali', path:  [
      {name: "device", uid: "device"}, {name: "dali", uid: "type"}, {name: "Mock Dali 1", uid: "aa24kf88as70"}
    ]},
  {name: "Safe Power 1", uid: "oa24kf88as7", company: 'safecility', deviceType: 'power', path: [
      {name: "device", uid: "device"}, {name: "power", uid: "type"}, {name: "Safe Power 1", uid: "oa24kf88as7"}
    ]},
  {name: "Big Power 1", uid: "oa24kf88as8", company: 'big-corp', deviceType: 'power', path: [
      {name: "device", uid: "device"}, {name: "power", uid: "type"}, {name: "Big Power 1", uid: "oa24kf88as8"}
    ] },
  {name: "Big Power 2", uid: "oa24kf88at8", company: 'big-corp', deviceType: 'power', path: [
      {name: "device", uid: "device"}, {name: "power", uid: "type"}, {name: "Big Power 2", uid: "oa24kf88at8"}
    ] },
  {name: "Small Power 1", uid: "oa24kf88as9", company: 'small-corp', deviceType: 'power', path:  [
      {name: "device", uid: "device"}, {name: "power", uid: "type"}, {name: "Small Power 1", uid: "oa24kf88as9"}
    ]},
  {name: "Mock Power 1", uid: "oa24kf88as0", company: 'mock-corp', deviceType: 'power', path:  [
      {name: "device", uid: "device"}, {name: "power", uid: "type"}, {name: "Mock Power 1", uid: "oa24kf88as0"}
    ]},
]

const deviceMap = new Map<string, Device>([
  ["aa24kf88as7", {name: "Safecility Dali 1", uid: "aa24kf88as7", deviceType: 'dali', active: true, firmware: 'daliB'}],
  ["aa24kf88as8", {name: "Big Dali 1", uid: "aa24kf88as8", deviceType: 'dali', active: true, firmware: 'daliB'}],
  ["aa24kf88as9", {name: "Small Dali 1", uid: "aa24kf88as9", deviceType: 'dali', active: true, firmware: 'daliA'}],
  ["oa24kf88as7", {name: "Safe Power 1", uid: "oa24kf88as7", deviceType: 'power', active: true, firmware: 'milesightCT'}],
  ["oa24kf88as8", {name: "Big Power 1", uid: "oa24kf88as8", deviceType: 'power', active: true, firmware: 'milesightCT'}],
  ["oa24kf88as9", {name: "Small Power 1", uid: "oa24kf88as9", deviceType: 'power', active: true, firmware: 'milesightCT'}],
  ["oa24kf88as0", {name: "Mock Power 1", uid: "oa24kf88as0", deviceType: 'power', active: true, firmware: 'milesightCT'}],
])

interface typedNavigationItem extends NavigationItem {
  deviceType: string
  company: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceMock {

  devices = new BehaviorSubject<Array<typedNavigationItem>>(deviceList)

  constructor() { }

  getDeviceList(deviceType: string, company?: string) : Observable<Array<NavigationItem>> {
    return this.devices.pipe(delay(400), map( (a) => {
      if (!a)
        return []
      let devices = a.filter(u => !!u).filter(x => !x || x.deviceType === deviceType);
      if (company) {
        devices = devices.filter(x => x.company === company)
      }
      return devices as Array<NavigationItem>
    }))
  }

  getDevice(uid: string) : Observable<Device | undefined> {
    return of(deviceMap.get(uid)).pipe(delay(300))
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
