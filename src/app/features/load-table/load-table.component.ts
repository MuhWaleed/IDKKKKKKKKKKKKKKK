import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MCardComponent } from "../../m-framework/components/m-card/m-card.component";

@Component({
  selector: 'app-load-table',
  standalone: true,
  imports: [CommonModule, MCardComponent],
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.css']
})
export class LoadTableComponent implements OnChanges {

  @Input() sections: any[] = [];

  instructorLoads: {
    instructor: string;
    count: number;
    color: string;
  }[] = [];

  ngOnChanges(): void {
    this.updateInstructorLoads();
  }

  updateInstructorLoads(): void {
    const loadMap: { [instructor: string]: number } = {};

    this.sections.forEach(section => {
      const name = section.instructor;
      loadMap[name] = loadMap[name] ? loadMap[name] + 1 : 1;
    });

    this.instructorLoads = [];

    Object.keys(loadMap).forEach(name => {
      const load = loadMap[name];
      const color = this.getLoadColor(load);
      this.instructorLoads.push({
        instructor: name,
        count: load,
        color: color
      });
    });
  }

  getLoadColor(load: number): string {
    if (load === 4) {
      return 'yellow';
    } else if (load > 4) {
      return 'red';
    } else {
      return 'lightgreen';
    }
  }
}
