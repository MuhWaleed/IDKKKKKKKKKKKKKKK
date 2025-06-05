import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCompassComponent } from './m-compass.component';

describe('MCompassComponent', () => {
  let component: MCompassComponent;
  let fixture: ComponentFixture<MCompassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MCompassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MCompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
