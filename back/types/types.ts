// Formations Controller
export interface FormationWithVideosFromDB {
  id_formation: number;
  title_formation: string;
  desc_formation: string;
  cover_path_formation: string;
  id_video: number;
  path_video: string;
  title_video: string;
  desc_video: string;
  cover_path_video: string;
}

export interface Video {
  id: number;
  path: string;
  title: string;
  desc: string;
  cover_path: string;
}

export interface FormationWithVideosFormated {
  id: number;
  title: string;
  desc: string;
  cover_path: string;
  videos: Video[];
}

// Vidéos Controller
export interface ParamsVideoById {
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
  answer_text: string;
}

export interface AnswerOption {
  id: number;
  answer_text: string;
}

export interface Question {
  id: number;
  question_text: string;
  explanation?: string;
  answer_options: AnswerOption[];
}

export interface Quiz {
  id: number;
  title_quiz: string;
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
}
