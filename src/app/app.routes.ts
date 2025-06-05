import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SessionFormComponent } from './pages/session-form/session-form.component';
import { VersionsComponent } from './pages/versions/versions.component';
import { ScheduleComponent } from './pages/session-form/schedule.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'session-form', component: SessionFormComponent },
  { path: 'versions', component: VersionsComponent },
  { path: 'schedule', component: ScheduleComponent },

];



