import { Component, Input } from '@angular/core';
import { Workout } from '../models/workout.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../models/exercise.model';
import { MuscleGroup } from '../models/muscle-group.enum';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workout-card',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule,
    CdkDrag,
    CdkDropList,
    NgFor
  ],
  templateUrl: './workout-card.component.html',
  styleUrl: './workout-card.component.scss',
})
export class WorkoutCardComponent {
  @Input() workout!: Workout;
  @Input() isEditMode!: boolean;
  muscleGroups = Object.values(MuscleGroup);

  newExercise: Partial<Exercise> = {
    name: '',
    muscleGroup: undefined,
    sets: undefined,
    repRange: { min: NaN, max: NaN },
  };

  addExercise(): void {
    if (this.newExercise.name && this.newExercise.muscleGroup) {
      this.workout.exercises = this.workout.exercises || [];
      this.workout.exercises.push({
        name: this.newExercise.name,
        muscleGroup: this.newExercise.muscleGroup,
        sets: this.newExercise.sets || 3,
        repRange: {
          min: this.newExercise.repRange?.min || 8,
          max: this.newExercise.repRange?.max || 12,
        },
      });
      this.updateWorkout();
      this.resetNewExercise();
    }
  }

  onExerciseDropped(event: CdkDragDrop<Exercise[]>) {
    // Only allow reordering within the same container
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.workout.exercises!,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  removeExercise(index: number): void {
    this.workout.exercises!.splice(index, 1);
    this.updateWorkout();
  }

  get workoutMuscleGroups(): MuscleGroup[] {
    let muscleGroups: MuscleGroup[] = []
    this.workout.exercises?.forEach((exercise) => {
      if (!muscleGroups.includes(exercise.muscleGroup)) {
        muscleGroups.push(exercise.muscleGroup);
      }
    });
    return muscleGroups
  }

  private updateWorkout(): void {
    this.workout.muscleGroups = [
      ...new Set(this.workout.exercises?.map((ex) => ex.muscleGroup) || []),
    ];
    this.workout.totalSets = this.workout.exercises?.map((exercise) => exercise.sets).reduce((a, b) => a + b, 0);
  }

  private resetNewExercise(): void {
    this.newExercise = {
      name: '',
      muscleGroup: undefined,
      sets: 3,
      repRange: { min: 8, max: 12 },
    };
  }
}
