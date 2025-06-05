import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MHeaderComponent } from './m-framework/components/m-header/m-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MHeaderComponent , RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent {
  title = 'Scheduling App';

 constructor() {
  
  }
}
