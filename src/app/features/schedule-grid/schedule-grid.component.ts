import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCardComponent } from "../../m-framework/components/m-card/m-card.component";

export interface EENSection {
  slotNumber: number | string;
  course: string;
  sectionNumber: string;
  instructor: string;
  campus: 'Abu Dhabi' | 'Al Ain';
}

@Component({
  selector: 'app-schedule-grid',
  standalone: true,
  imports: [CommonModule, MCardComponent],
  templateUrl: './schedule-grid.component.html',
  styleUrls: ['./schedule-grid.component.css']
})
export class ScheduleGridComponent {

  @Input() sections: EENSection[] = [];

  slots: { number: number; label: string }[] = [
    { number: 1, label: 'MW 09:00–10:45' },
    { number: 2, label: 'MW 10:55–12:40' },
    { number: 3, label: 'MW 12:50–14:35' },
    { number: 4, label: 'MW 15:00–16:45' },
    { number: 5, label: 'MW 16:55–18:40' },
    { number: 6, label: 'MW 18:50–20:35' },
    { number: 7, label: 'MW 20:45–22:30' },
    { number: 8, label: 'TR 09:00–10:45' },
    { number: 9, label: 'TR 10:55–12:40' },
    { number: 10, label: 'TR 12:50–14:35' },
    { number: 11, label: 'TR 15:00–16:45' },
    { number: 12, label: 'TR 16:55–18:40' },
    { number: 13, label: 'TR 18:50–20:35' },
    { number: 14, label: 'TR 20:45–22:30' }
  ];

  getSectionsForSlot(slotNum: number, campusName: string): EENSection[] {
    return this.sections.filter(section =>
      Number(section.slotNumber) === slotNum && section.campus === campusName
    );
  }
}
