import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {Device} from "../../device.model";
import {DeviceService} from "../../device.service";
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'lib-device-list',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatSortModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent {
  displayedColumns: string[] = ['select', 'name', 'tag', 'uid', 'type', 'active'];
  dataSource = new MatTableDataSource<Device>();
  selection = new SelectionModel<Device>(true, []);

  @Input() set deviceType(type: string | undefined) {
    this.deviceService.getResourceList(type).subscribe({
      next: value => {
        this.dataSource.data = value;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if(paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if(sort) {
      this.dataSource.sort = sort;
      this.dataSource.sort.sortChange.subscribe(() => {
          if (this.dataSource.paginator)
            this.dataSource.paginator.pageIndex = 0;
        }
      );
    }
  }

  @Output() selectedDevices = new EventEmitter<Array<Device>>()

  constructor(private deviceService: DeviceService) {
    this.selection.changed.subscribe({
      next: value => {
        console.log("sort change", value)
        this.selectedDevices.next(value.source.selected)
      }
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Device): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  announceSortChange(sortState: Sort) {
    console.log("sor")
  }
}
