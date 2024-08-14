import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder, FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { map, Observable, of } from "rxjs";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { LocationSelectComponent } from "safecility-admin-company";
import { MatInput } from "@angular/material/input";
import { DeviceService } from "../../device.service";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {DeviceUpdate} from "../device-add-editor/device-add-editor.component";

interface FormState {
  current: any
  type: string | undefined
  emitted: object | undefined
}

@Component({
  selector: 'lib-add-device-single',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LocationSelectComponent,
    MatLabel,
    MatInput,
    MatError,
    MatFormField,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
  ],
  templateUrl: './add-device-single.component.html',
  styleUrl: './add-device-single.component.css'
})
export class AddDeviceSingleComponent {

  @Input() set companyUID(companyUID: string | undefined) {
    if (!companyUID)
      return;
    console.log("got company", companyUID)
    this.addForm.get('company')?.setValue(companyUID);
  }

  @Input() set disabled(disabled: boolean | undefined) {
    if (disabled)
      this.addForm.disable()
    else
      this.addForm.enable()
  }

  @Input() deviceTypes= new Map<string, any>(
    [
      ["undefined", []],
      ["power", [{name: "hotdrop", versions: [2, 1]}, {name:"milesight", versions: [1]}, {name: "eastron", versions: [1]}]],
      ["dail",  [{name: "safecility", versions: [2, 1]}]]]
  );

  @Input() set deviceType(deviceType: string | undefined) {
    this.addForm.get("type")?.setValue(deviceType);
    this._deviceType = deviceType;
  }
  _deviceType: string | undefined;

  @Output() valueChanged = new EventEmitter<DeviceUpdate | undefined>();

  locations: Array<string> | undefined;

  addForm: FormGroup;
  _valid: boolean = false;

  state: FormState = {
    current: undefined,
    type: undefined,
    emitted: undefined,
  }

  constructor(
    private deviceService: DeviceService,
    private formBuilder: FormBuilder,
  ) {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      uid: ["", [Validators.required, Validators.pattern], this.uniqueUid()],
      tag: ["", [Validators.required, Validators.pattern], this.uniqueTag()],
      type: [null, Validators.required],
      location: [null, Validators.required],
      company: [null, Validators.required],
      active: [false],
      // version: this.formBuilder.group({
      //   firmwareName: [null, Validators.required],
      //   firmwareVersion: [null, Validators.required],
      // }),
      firmware: [null],
      downlink: [""],
    });

    this.addForm.valueChanges.subscribe( _ => {
      if (this.state.current === this.addForm.value)
        return;
      this.state.current = this.addForm.value;
      this.updateValue();
      // if (this.state.type !== this.addForm.controls.type.value) {
      //   this.state.type = this.addForm.controls.type.value;
      //   const chosenVersion = this.deviceTypes.get(this.addForm.controls.type.value)
      //
      // }
    })
    this.addForm.statusChanges.subscribe( x => {
      if (!x)
        return;
      this._valid = x === 'VALID';
      this.updateValue();
    })
  }

  get name(): FormControl<string> {
    return <FormControl<string>>this.addForm.get('name'); }

  get type(): FormControl<string> {
    return <FormControl<string>>this.addForm.get('type'); }

  get uid(): FormControl<string> {
    return <FormControl<string>>this.addForm.get('uid'); }

  updateValue() {
    if (this.state.emitted === this.addForm.value)
      return;
    let emitValue: DeviceUpdate = {device: this.addForm.value, valid: this._valid};
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
          console.log("exists", x)
          return {uidExists: uid}
        })
      )
    }
  }

  uniqueTag(): AsyncValidatorFn {
    return (_: AbstractControl): Observable<ValidationErrors | null> => {
      const tag = this.addForm?.get('tag')?.value;
      if (!tag)
        return of(null)
      return of(null)
    }
  }
}
