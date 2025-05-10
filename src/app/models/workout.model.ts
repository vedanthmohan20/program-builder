import { MuscleGroup } from './muscle-group.enum';
import { Exercise } from './exercise.model';

export interface Workout {
  name: string;
  isRestDay: boolean;
  muscleGroups?: MuscleGroup[];
  totalSets?: number;
  exercises?: Exercise[];
}