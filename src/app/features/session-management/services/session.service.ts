import { Injectable } from '@angular/core';
import { Database, ref, push, onValue, remove, update } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private database: Database) {}

  addEENSection(section: EENSection) {
    const sectionPath = ref(this.database, 'een-sections');
    const dataToSave = {
      course: section.course,
      sectionNumber: section.sectionNumber,
      instructor: section.instructor,
      slotNumber: section.slotNumber,
      campus: section.campus,
      capacity: section.capacity,
      timestamp: Date.now()
    };

    return push(sectionPath, dataToSave);
  }

  getEENSections(callback: (sections: (EENSection & { key: string })[]) => void) {
    const sectionPath = ref(this.database, 'een-sections');
    onValue(sectionPath, (snapshot) => {
      const data = snapshot.val();
      const sectionList = data
        ? Object.entries(data).map(([key, value]: any) => ({ key, ...value }))
        : [];
      callback(sectionList);
    });
  }

  deleteEENSection(key: string) {
    const sectionRef = ref(this.database, `een-sections/${key}`);
    return remove(sectionRef);
  }

  
  updateSection(key: string, updatedData: Partial<EENSection>) {
    const sectionRef = ref(this.database, `een-sections/${key}`);
    return update(sectionRef, updatedData);
  }
}

export interface EENSection {
  slotNumber: number;
  course: string;
  sectionNumber: string;
  instructor: string;
  campus: 'Abu Dhabi' | 'Al Ain';
  capacity: 'Regular' | 'Large' | 'Mega';
}
