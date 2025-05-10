import { MuscleGroup } from './muscle-group.enum';
import { RepRange } from './rep-range.model';

export interface Exercise {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  repRange: RepRange;
}