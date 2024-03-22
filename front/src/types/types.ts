export interface Formation {
  id: number;
  title: string;
  description?: string;
  cover_path: string;
  modules: Module[];
}

export interface Module {
  id: number;
  id_formation: number;
  title: string;
  description: string;
}

export interface Video {
  id_video: number;
  path_video: string;
  title_video: string;
  description_video: string;
  cover_path_video: string;
}

export interface Text {
  id_text: number;
  title_text: string;
  content_text: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface ModuleCollapseItem {
  id: string;
  title: string;
  type: string;
  item: Video | Text | Quiz | null;
}

export interface Question {
  id: number;
  text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  text: string;
}

export interface ContentByModule {
  id: number;
  videos: Video[];
  texts: Text[];
}

export interface QuizByModule {
  id: number;
  title: string;
  questions: Question[];
}

export interface FormationItemProps {
  formation: Formation;
}

export interface UserAnswer {
  id_user: number;
  id_question: number;
  id_answer_option: number;
  date_answer: string;
  id_quiz: number;
}

export interface FullAnswerOption {
  id: number;
  id_question: number;
  answer_text: string;
  correct: boolean;
}

export interface IsCorrectAnswer {
  isCorrectAnswerSelected: boolean;
  idAnswerOptionSelected: number;
  correctAnswer: FullAnswerOption;
}
