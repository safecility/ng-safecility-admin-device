import { Resource } from "safecility-admin-services";

export interface Device extends Resource {
  active?: boolean
  deviceType?: string
  firmware?: any
  processors?: Map<string, any>
}
