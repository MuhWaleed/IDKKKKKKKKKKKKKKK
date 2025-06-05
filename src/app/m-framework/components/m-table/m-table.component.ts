import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDeleteButtonComponent } from '../m-delete-button/m-delete-button.component';

@Component({
  selector: 'm-table',
  standalone: true,
  imports: [CommonModule, MDeleteButtonComponent],
  templateUrl: './m-table.component.html',
  styleUrls: ['./m-table.component.css'],
})
export class MTableComponent {
  @Input() showCaption: boolean = false;
  @Input() data: any[] = [];
  @Input() showDeleteButton: boolean = false;
  @Input() showMoreDetails: boolean = false;
  @Input() caption: string = '';
  @Input() columnsToBeDisplayed: string[] = [];
  @Input() tableHeaders: string[] = [];

  @Output() deleteItem = new EventEmitter<any>();
  @Output() moreDetails = new EventEmitter<any>();

  get isStringData(): boolean {
    return typeof this.data[0] === 'string';
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  removeItem(item: any): void {
    this.deleteItem.emit(item);
  }

  showDetails(item: any): void {
    this.moreDetails.emit(item);
  }
}
