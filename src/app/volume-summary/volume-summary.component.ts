import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MuscleGroup } from '../models/muscle-group.enum';

@Component({
  selector: 'app-volume-summary',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './volume-summary.component.html',
  styleUrl: './volume-summary.component.scss'
})
export class VolumeSummaryComponent {
  @Input() muscleGroupToVolume!: Map<MuscleGroup, number>;

  get entries() {
    return Array.from(this.muscleGroupToVolume?.entries?.() ?? []);
  }
}
