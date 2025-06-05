import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'm-compass',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './m-compass.component.html',
  styleUrls: ['./m-compass.component.css']
})
export class MCompassComponent implements OnChanges {
  @Input() angle: number | null = 0;
  @Input() size: string = '200px';
  @Input() centered: boolean = false;

  rotationStyle: string = 'rotate(0deg)';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['angle'] && this.angle != null) {
      this.rotationStyle = `rotate(${-this.angle}deg)`;
    }
  }
}
