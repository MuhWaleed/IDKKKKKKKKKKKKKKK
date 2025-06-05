import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { SessionService } from '../../features/session-management/services/session.service';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-versions',
  imports: [MContainerComponent, CommonModule, FormsModule],
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsComponent implements OnInit {

  versions: any[] = [];
  comparisonResults: string[] = [];
  selectedVersion: any = null;

  private db = getDatabase();

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loadVersions();
  }

  saveVersion(): void {
    const timestamp = new Date().toISOString();

    this.sessionService.getEENSections((sections) => {
      const version = { timestamp, data: sections };
      const newVersionRef = push(ref(this.db, 'versions'));
      set(newVersionRef, version);
    });
  }

  loadVersions(): void {
    const versionsRef = ref(this.db, 'versions');

    onValue(versionsRef, (snapshot) => {
      const data = snapshot.val();
      this.versions = [];

      for (let id in data) {
        this.versions.push({
          id,
          ...data[id],
          selected: false
        });
      }
    });
  }

  getSelectedVersions(): any[] {
    return this.versions.filter(v => v.selected);
  }

  compareVersions(): void {
    interface Session {
      course: string;
      sectionNumber: string;
      instructor: string;
      slotNumber: string;
      campus: string;
      [key: string]: any;
    }

    this.comparisonResults = [];

    const [v1, v2] = this.getSelectedVersions();
    const key = (s: Session) => `${s.course}-${s.sectionNumber}`;

    const map1 = new Map<string, Session>(v1.data.map((s: Session) => [key(s), s]));
    const map2 = new Map<string, Session>(v2.data.map((s: Session) => [key(s), s]));

    const added: string[] = [];
    const removed: string[] = [];
    const moved: string[] = [];
    const reassigned: string[] = [];
    const relocated: string[] = [];

    map1.forEach((s1, id) => {
      const s2 = map2.get(id);
      if (!s2) {
        removed.push(`❌ ${id} by ${s1.instructor} (Slot ${s1.slotNumber}, ${s1.campus})`);
      } else {
        if (s1.slotNumber !== s2.slotNumber) {
          moved.push(`🔄 ${id} moved from Slot ${s1.slotNumber} to Slot ${s2.slotNumber}`);
        }
        if (s1.instructor !== s2.instructor) {
          reassigned.push(`👤 ${id} reassigned from ${s1.instructor} to ${s2.instructor}`);
        }
        if (s1.campus !== s2.campus) {
          relocated.push(`🏫 ${id} relocated from ${s1.campus} to ${s2.campus}`);
        }
      }
    });

    map2.forEach((s2, id) => {
      if (!map1.has(id)) {
        added.push(`➕ ${id} by ${s2.instructor} (Slot ${s2.slotNumber}, ${s2.campus})`);
      }
    });

    const sortList = (list: string[]) => list.sort((a, b) => a.localeCompare(b));

    this.comparisonResults = [
      ...(added.length ? ['<strong>➕ Added:</strong>', ...sortList(added)] : []),
      ...(removed.length ? ['<strong>❌ Removed:</strong>', ...sortList(removed)] : []),
      ...(moved.length ? ['<strong>🔄 Slot Changes:</strong>', ...sortList(moved)] : []),
      ...(reassigned.length ? ['<strong>👤 Instructor Changes:</strong>', ...sortList(reassigned)] : []),
      ...(relocated.length ? ['<strong>🏫 Campus Changes:</strong>', ...sortList(relocated)] : []),
    ];
  }

  onVersionSelect(version: any): void {
    version.selected = !version.selected;
  }

  openModal(version: any): void {
    this.selectedVersion = version;
  }

  closeModal(): void {
    this.selectedVersion = null;
  }

  deleteVersion(id: string): void {
    const versionRef = ref(this.db, `versions/${id}`);
    set(versionRef, null); // delete from Firebase

    this.versions = this.versions.filter(v => v.id !== id);
  }
}
