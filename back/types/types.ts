// Formations Controller
export interface Video {
  id: number;
  path: string;
  title: string;
  desc: string;
  cover_path: string;
}

// Vidéos Controller
export interface ParamsId {
  id: number;
}

export interface ResponseFromDB {
  id: number;
  id_formation: number;
  title_video: string;
  path: string;
  desc_video: string;
  cover_path: string;
  id_video: number;
  id_quiz: number;
  title_quiz: string;
  question_text: string;
  explanation: string;
  id_question: number;
  id_answer_option: number;
  is_multiple_choice: boolean;
  answer_text: string;
}

export interface AnswerOption {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOption[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface StructuredVideo {
  id: number;
  id_formation: number;
  path: string;
  title: string;
  desc?: string;
  cover_path: string;
  quizzes: Quiz[];
}

// Questions Controller
export interface BodyGetCorrectAnswer {
  id_question: number;
  id_answer_option_selected: number;
}

export interface AnswerOptionFromDB {
  id: number;
  id_question: number;
  answer_text: string;
  correct: boolean;
}

// User Stats Controller
export interface BodySaveUserAnswer {
  id_user: number;
  id_question: number;
  id_answer_option: number;
  date_answer: string;
  id_quiz: number;
}
// New DB with Modules
export interface Module {
  id: number;
  id_formation: number;
  title: string;
  description: string;
}

export interface FormationWithModule {
  id: number;
  title: string;
  description: string;
  cover_path: string;
  modules: Module[];
}

export interface BodyGetUserAnswer {
  id_user: number;
  id_quiz: number;
}
