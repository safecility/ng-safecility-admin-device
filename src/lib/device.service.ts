import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, timer, of, delay } from "rxjs";

import { NavigationItem } from "safecility-admin-services";
import { Device } from "./device.model";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { deviceList } from "./device.mock";
import { environmentToken } from "safecility-admin-services";

const deviceMap = new Map<string, Device>([
  ["aa24kf88as7", {name: "Safecility Dali 1", uid: "aa24kf88as7", type: 'dali', active: true}],
  ["aa24kf88as8", {name: "Big Dali 1", uid: "aa24kf88as8", type: 'dali', active: true}],
  ["aa24kf88as9", {name: "Small Dali 1", uid: "aa24kf88as9", type: 'dali', active: true}],
  ["oa24kf88as7", {name: "Safe Power 1", uid: "oa24kf88as7", type: 'power', active: true}],
  ["oa24kf88as8", {name: "Big Power 1", uid: "oa24kf88as8", type: 'power', active: true}],
  ["oa24kf88as9", {name: "Small Power 1", uid: "oa24kf88as9", type: 'power', active: true}],
])

interface typedNavigationItem extends NavigationItem {
  type: string
}

const authHeaders = new HttpHeaders(
  {
    "Access-Control-Allow-Headers": "Origin, Authorization",
  }
)

interface environment {
  api: {
    microservices: boolean
    device: string
  }
}

export interface listOptions {
  companyUID?: string
  showInactive?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  devices = new BehaviorSubject<Array<typedNavigationItem>>(deviceList);
  options = {}

  constructor(
    @Inject(environmentToken) private environment: environment,
    private httpClient: HttpClient,
  ) {
    if (environment.api.microservices)
      this.options = {headers: authHeaders, withCredentials: true}
  }

  getDeviceList(type?: string, query?: listOptions | undefined) : Observable<Array<Device>> {
    let deviceURL = `${this.environment.api.device}/device/list`;
    if (type)
      deviceURL = deviceURL + "/" + type
    if (query) {
      let params = new HttpParams()
      params = params.set('showInactive', !query.showInactive)
      if (query.companyUID)
        params = params.set('companyUID', query.companyUID)
      if (params.keys().length > 0)
        deviceURL = `${deviceURL}?${params.toString()}`
    }
    return this.httpClient.get<Array<Device>>(deviceURL, this.options)
  }

  getResourceList(type?: string, query?: listOptions | undefined) : Observable<Array<NavigationItem>> {
    let deviceURL = `${this.environment.api.device}/device/resource`;
    if (type)
      deviceURL = deviceURL + "/" + type
    if (query) {
      let params = new HttpParams()
      params = params.set('showInactive', !query.showInactive)
      if (query.companyUID)
        params = params.set('companyUID', query.companyUID)
      if (params.keys().length > 0)
        deviceURL = `${deviceURL}?${params.toString()}`
    }
    return this.httpClient.get<Array<NavigationItem>>(deviceURL, this.options)
  }

  getDevice(uid: string) : Observable<Device | undefined> {
    let deviceURL = `${this.environment.api.device}/device/uid/${uid}`
    return this.httpClient.get<Device>(deviceURL, this.options)
  }

  addDevice(device: any): Observable<boolean> {
    let deviceURL = `${this.environment.api.device}/device/uid/${device.uid}`
    return this.httpClient.post<boolean>(deviceURL, device, this.options)
  }

  updateDevice(device: Device): Observable<boolean> {
    let deviceURL = `${this.environment.api.device}/device/uid/${device.uid}`
    return this.httpClient.put<boolean>(deviceURL, device, this.options)
  }

  archiveDevice(uid: string) {
    let deviceURL = `${this.environment.api.device}/device/uid/${uid}/archive`;
    return this.httpClient.put<Device>(deviceURL, {uid, action: 'archive'}, this.options).pipe(map( x => {
      return !!x
    }));
  }

  toggleDevice(device: Device) {
    let deviceURL = `${this.environment.api.device}/device/uid/${device.uid}/active`;
    return this.httpClient.put<Device>(deviceURL, device, this.options).pipe(map( x => {
      return !!x
    }))
  }

  uidExists(uid: string): Observable<boolean> {
    return of(this.devices.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

  tagExists(uid: string): Observable<boolean> {
    return of(this.devices.value.reduce((p, c) => {
      if (c.uid === uid)
        p = true
      return p
    }, false)).pipe(delay(300))
  }

}
