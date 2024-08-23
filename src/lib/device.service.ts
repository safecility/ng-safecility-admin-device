import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, timer, of, delay } from "rxjs";

import { NavigationItem } from "safecility-admin-services";
import { Device } from "./device.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { deviceList } from "./device.mock";
import { environmentToken } from "safecility-admin-services";

const deviceMap = new Map<string, Device>([
  ["aa24kf88as7", {name: "Safecility Dali 1", uid: "aa24kf88as7", deviceType: 'dali', active: true}],
  ["aa24kf88as8", {name: "Big Dali 1", uid: "aa24kf88as8", deviceType: 'dali', active: true}],
  ["aa24kf88as9", {name: "Small Dali 1", uid: "aa24kf88as9", deviceType: 'dali', active: true}],
  ["oa24kf88as7", {name: "Safe Power 1", uid: "oa24kf88as7", deviceType: 'power', active: true}],
  ["oa24kf88as8", {name: "Big Power 1", uid: "oa24kf88as8", deviceType: 'power', active: true}],
  ["oa24kf88as9", {name: "Small Power 1", uid: "oa24kf88as9", deviceType: 'power', active: true}],
])

interface typedNavigationItem extends NavigationItem {
  deviceType: string
}

const authHeaders = new HttpHeaders(
  {
    "Access-Control-Allow-Headers": "Origin, Authorization",
  }
)

interface environment {
  api: {
    device: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  devices = new BehaviorSubject<Array<typedNavigationItem>>(deviceList)

  constructor(
    @Inject(environmentToken) private environment: environment,
    private httpClient: HttpClient,
  ) {
  }

  getDeviceList(deviceType: string, company?: string) : Observable<Array<NavigationItem>> {
    let deviceURL = `${this.environment.api.device}/device/list`;
    if (deviceType)
      deviceURL = deviceURL + "/" + deviceType;
    return this.httpClient.get<Array<NavigationItem>>(deviceURL, {headers: authHeaders, withCredentials: true})
  }

  getDevice(uid: string) : Observable<Device | undefined> {
    console.log("getting device", this.environment.api.device)
    let deviceURL = `${this.environment.api.device}/device/uid/${uid}`;
    return this.httpClient.get<Device>(deviceURL)
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
