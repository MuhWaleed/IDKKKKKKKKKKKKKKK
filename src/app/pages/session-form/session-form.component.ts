import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../features/session-management/services/session.service';
import { MCardComponent } from '../../m-framework/components/m-card/m-card.component';
import { MAhaComponent } from '../../m-framework/components/m-aha/m-aha.component';
import { Database, ref, onValue, remove, update } from '@angular/fire/database';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { ScheduleGridComponent } from '../../features/schedule-grid/schedule-grid.component';
import { LoadTableComponent } from '../../features/load-table/load-table.component';
import { detectScheduleIssues } from '../../features/session-management/services/error-check.service';
import { MTableComponent } from '../../m-framework/components/m-table/m-table.component';

interface ExtendedEENSection {
  slotNumber: number;
  course: string;
  sectionNumber: string;
  instructor: string;
  campus: 'Abu Dhabi' | 'Al Ain';
  capacity: 'Regular' | 'Large' | 'Mega';
  key?: string;
}

@Component({
  standalone: true,
  selector: 'app-session-form',
  imports: [
    CommonModule,
    FormsModule,
    MCardComponent,
    MContainerComponent,
    ScheduleGridComponent,
    LoadTableComponent,
    MAhaComponent,
    MTableComponent
  ],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.css'],
})
export class SessionFormComponent implements OnInit {
  section: ExtendedEENSection = {
    slotNumber: 1,
    course: '',
    sectionNumber: '',
    instructor: '',
    campus: 'Abu Dhabi',
    capacity: 'Regular'
  };

  sections: ExtendedEENSection[] = [];
  detectedIssues: ({ type: string; message: string; displayType?: string })[] = [];
  editingKey: string | null = null;

  allowedCourses: string[] = ['EEN301', 'EEN302', 'CEN201', 'CEN202', 'EEN210', 'EEN365', 'CEN325', 'CEN304'];
  instructorPattern: RegExp = /^[a-zA-Z .'-]{3,}$/;

  constructor(
    private sessionService: SessionService,
    private db: Database
  ) {}

  ngOnInit(): void {
    this.listenToSections();
  }

  isValidSection(section: ExtendedEENSection): boolean {
    const validSlot = section.slotNumber >= 1 && section.slotNumber <= 14;
    const validCourse = this.allowedCourses.includes(section.course.trim());
    const validInstructor = this.instructorPattern.test(section.instructor.trim());
    const validSectionNumber = /^\d+$/.test(section.sectionNumber);
    const validCapacity = ['Regular', 'Large', 'Mega'].includes(section.capacity);
    return validSlot && validCourse && validInstructor && validSectionNumber && validCapacity;
  }

  onSubmit(form: NgForm): void {
    if (this.isValidSection(this.section)) {
      this.sessionService.addEENSection(this.section).then(() => {
        this.resetForm();
        form.resetForm();
      });
    } else {
      alert('Invalid form submission. Please check all fields.');
    }
  }

  resetForm(): void {
    this.section = {
      slotNumber: 1,
      course: '',
      sectionNumber: '',
      instructor: '',
      campus: 'Abu Dhabi',
      capacity: 'Regular'
    };
  }

  listenToSections(): void {
    const sectionRef = ref(this.db, 'een-sections');
    onValue(sectionRef, (snapshot) => {
      const data = snapshot.val();
      this.sections = [];
      for (let key in data) {
        const section = { ...data[key], key };
        section.capacity = String(section.capacity);
        this.sections.push(section);
      }
      const rawIssues = detectScheduleIssues(this.sections);
      this.detectedIssues = rawIssues.map(issue => ({
        ...issue,
        displayType: issue.type === 'Error' ? '❌ ERROR' : '⚠️ WARNING'
      }));
    });
  }

  deleteSection(item: any): void {
    const key = item?.key;
    if (key) {
      const sectionRef = ref(this.db, `een-sections/${key}`);
      remove(sectionRef)
        .then(() => console.log(`Deleted section with key: ${key}`))
        .catch((err) => console.error('Delete failed:', err));
    }
  }

  enableEditing(section: ExtendedEENSection): void {
    this.editingKey = section.key || null;
  }

  saveSection(section: ExtendedEENSection): void {
    const validSectionNumber = this.isSectionNumberValid(section.sectionNumber);
    const validInstructor = this.isInstructorValid(section.instructor);

    if (!validSectionNumber || !validInstructor) {
      console.warn("Cannot save: Invalid section or instructor");
      return; // Block save
    }

    if (section.key) {
      const sectionRef = ref(this.db, `een-sections/${section.key}`);
      const { key, ...cleaned } = section;
      update(sectionRef, cleaned)
        .then(() => {
          console.log('Section updated.');
          this.editingKey = null;
        })
        .catch(err => console.error('Update failed:', err));
    }
  }

  isSectionNumberValid(value: string): boolean {
    return /^\d+$/.test(value?.trim());
  }

  isInstructorValid(value: string): boolean {
    return this.instructorPattern.test(value?.trim());
  }

  isSectionNumberValidTemplate = this.isSectionNumberValid;
  isInstructorValidTemplate = this.isInstructorValid;
}
