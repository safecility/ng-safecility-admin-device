import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Device} from "../../device.model";
import {DeviceUpdate} from "../device-add-editor/device-add-editor.component";
import {DeviceService} from "../../device.service";
import {map, Observable, of, Subject} from "rxjs";
import {Resource, ResourceSelect, SelectorService} from "safecility-admin-services";

interface FormState {
  current: any
  type: string | undefined
  emitted: object | undefined
}

@Component({
  selector: 'lib-edit-device',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ResourceSelect
  ],
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.css'
})
export class EditDeviceComponent {

  deviceUpdate: boolean = false;

  @Input() set device(device: Device | undefined){
    if (!device)
      return
    const uidControl = this.editForm.get('uid');
    if (!uidControl)
      return
    uidControl.disable();
    uidControl.clearAsyncValidators();

    this.deviceUpdate = true;

    //these should match but make sure
    const editValue = {
      name: device.name,
      uid: device.uid,
      active: device.active,
      type: device.type,
      tag: device.tag ? device.tag : null,
      locationUID: device.locationUID ? device.locationUID : null,
      companyUID: device.companyUID ? device.companyUID : null,
      firmware: device.firmware ? device.firmware : null,
    }

    console.log("editing", editValue);
    this.editForm.setValue(editValue);
    this._deviceType = device.type;
  }

  @Input() set companyUID(companyUID: string | undefined) {
    if (!companyUID)
      return;
    this.editForm.get('companyUID')?.setValue(companyUID);
  }

  @Input() set disabled(disabled: boolean | undefined) {
    if (disabled)
      this.editForm.disable()
    else
      this.editForm.enable()
  }

  @Input() deviceTypes= new Map<string, any>(
    [
      ["undefined", []],
      ["power", [{name: "hotdrop", versions: [2, 1]}, {name:"milesight", versions: [1]}, {name: "eastron", versions: [1]}]],
      ["dail",  [{name: "safecility", versions: [2, 1]}]]]
  );

  @Input() set deviceType(deviceType: string | undefined) {
    if (!deviceType)
      return
    this.editForm.get("type")?.setValue(deviceType);
    this._deviceType = deviceType;
  }
  _deviceType: string | undefined;

  @Output() valueChanged = new EventEmitter<DeviceUpdate | undefined>();

  companyList: Array<Resource> | undefined;
  companySubject = new Subject<boolean>()
  locationsList: Array<Resource> | undefined;

  editForm: FormGroup;

  state: FormState = {
    current: undefined,
    type: undefined,
    emitted: undefined,
  }

  constructor(
    private deviceService: DeviceService,
    private selectorService: SelectorService,
    private formBuilder: FormBuilder,
  ) {
    this.editForm = this.formBuilder.group({
      name: ["", Validators.required],
      uid: ["", [Validators.required, Validators.pattern], this.uniqueUid()],
      tag: ["", [Validators.required, Validators.pattern], this.uniqueTag()],
      type: ["", Validators.required],
      companyUID: [null, Validators.required],
      locationUID: [{value:null, disabled: true}, Validators.required],
      active: [false],
      // firmware: this.formBuilder.group({
      //   name: [null],
      //   version: [null],
      // }),
      firmware: [null],
    });

    this.editForm.valueChanges.subscribe(value => {
      if (this.state.current === this.editForm.value)
        return;

      const companyChange = this.state.current?.companyUID !== value.companyUID

      this.state.current = this.editForm.value;

      if (companyChange) {
        if (!value.companyUID) {
          this.editForm.get('locationUID')?.disable();
          return;
        }
        this.getLocations();
      }
      this.updateValue();
    })

    this.selectorService.listCompanies().subscribe({
      next: value => {
        this.companyList = value;
        this.companySubject.next(true);
        console.log("got companies list", value);
      },
      error: err => {
        console.error(err);
      }
    })
  }

  get name(): FormControl<string> {
    return <FormControl<string>>this.editForm.get('name'); }

  get tag(): FormControl<string> {
    return <FormControl<string>>this.editForm.get('tag'); }

  get type(): FormControl<string> {
    return <FormControl<string>>this.editForm.get('type'); }

  get uid(): FormControl<string> {
    return <FormControl<string>>this.editForm.get('uid'); }

  updateValue() {
    if (this.state.emitted === this.editForm.value)
      return;

    let emitValue: DeviceUpdate = {device: this.editForm.getRawValue(), valid: this.editForm.valid, update: this.deviceUpdate};
    this.state.emitted = emitValue;
    this.valueChanged.next(emitValue);
  }

  uniqueUid(): AsyncValidatorFn {
    return (ac: AbstractControl): Observable<ValidationErrors | null> => {
      const uid = ac.getRawValue();
      if (!uid)
        return of({uidInvalid: uid})
      return this.deviceService.uidExists(uid).pipe(
        map(x => {
          if (!x)
            return null
          return {uidExists: uid}
        })
      )
    }
  }

  uniqueTag(): AsyncValidatorFn {
    return (ac: AbstractControl): Observable<ValidationErrors | null> => {
      const tag = ac.getRawValue();
      if (!tag)
        return of({tagInvalid: tag})
      return this.deviceService.tagExists(tag).pipe(
        map(x => {
          if (!x)
            return null
          return {tagExists: tag}
        })
      )
    }
  }

  getLocations() {
    const companyUID = this.editForm.value.companyUID;
    this.editForm.get('locationUID')?.disable();

    if (!companyUID)
      return

    this.selectorService.listLocations(companyUID).subscribe({
      next: value => {
        this.locationsList = value;
        this.editForm.get('locationUID')?.enable();
      },
      error: err => {
        console.error(err);
      }
    })
  }

}
