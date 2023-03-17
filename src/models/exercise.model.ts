export type ExerciseQuestion = {
  course: string;
  grade: string;
  _id?: string;
  questionText: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  description: string;

  image?: string;
  questionNumber?: number;
  courseId?: string;
  direction?: string;
  questionImage?: string;
  descriptionImage?: string;
  chapter: string;
  exerciseNumber: string;
};
