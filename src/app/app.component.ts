import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VolumeSummaryComponent } from './volume-summary/volume-summary.component';
import { MuscleGroup } from './models/muscle-group.enum';
import { Workout } from './models/workout.model';
import { WorkoutCardComponent } from './workout-card/workout-card.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    VolumeSummaryComponent,
    WorkoutCardComponent,
    FormsModule,
    DragDropModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isEditMode: boolean = false;
  muscleGroupToVolume: Map<MuscleGroup, number> = new Map<
    MuscleGroup,
    number
  >();
  workouts: Workout[] = [];
  programNotes: string = '';

  constructor() {
    // initialise the muscleMap with all muscle groups set to 0
    Object.values(MuscleGroup).forEach((muscleGroup) => {
      this.muscleGroupToVolume.set(muscleGroup, 0);
    });

    // initialise all workouts to be rest days
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    for (let i = 0; i < 7; i++) {
      this.workouts.push({
        name: `${days[i]}`,
        isRestDay: true,
      });
    }
  }

  setMode(editMode: boolean): void {
    this.isEditMode = editMode;

    if (editMode === false) {
      this.recalculateTotalVolume();
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.workouts, event.previousIndex, event.currentIndex);
  }

  private recalculateTotalVolume() {
    Object.values(MuscleGroup).forEach((muscleGroup) => {
      this.muscleGroupToVolume.set(muscleGroup, 0);
    });

    this.workouts.forEach((workout) => {
      if (!workout.isRestDay && workout.exercises) {
        workout.exercises.forEach((exercise) => {
          const currentVolume =
            this.muscleGroupToVolume.get(exercise.muscleGroup) || 0;
          this.muscleGroupToVolume.set(
            exercise.muscleGroup,
            currentVolume + exercise.sets
          );
        });
      }
    });
  }

  importWorkouts(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        this.workouts = JSON.parse(reader.result as string);
        this.recalculateTotalVolume();
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    };

    reader.readAsText(file);
  }

  exportWorkouts(): void {
    this.exportToJsonFile();
    this.exportToPdfFile();
  }

  private exportToJsonFile(): void {
    const jsonStr = JSON.stringify(this.workouts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout-program.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  private exportToPdfFile(): void {
    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error(
        "Cannot find element with id 'pdf-content' to export to PDF"
      );
      return;
    }

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');

      // scale image to 95% of PDF width
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth * 0.95;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Calculate centered X and Y positions
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('workout-program.pdf');
    });
  }
}
