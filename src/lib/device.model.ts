import { Resource } from "safecility-admin-services";

export interface Device extends Resource {
  tag?: string
  companyUID?: string
  locationUID?: string
  active?: boolean
  type?: string
  firmware?: {
    name: string,
    version: string,
  }
  processors?: Map<string, any>
}
