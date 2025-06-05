import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { MCardComponent } from '../../m-framework/components/m-card/m-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,MContainerComponent, FormsModule, MCardComponent], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css' 
})


export class HomeComponent {
  constructor(private router: Router) {}

  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  goToVersions() {
    this.router.navigate(['/versions']); 
  }
}
