export interface Video {
  id: number;
  path: string;
  title: string;
  desc?: string;
  cover_path: string;
}

export interface Formation {
  id: number;
  title: string;
  desc?: string;
  cover_path: string;
  videos: Video[];
}

export interface FormationItemProps {
  formation: Formation;
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

export interface VideoWithCompleteQuiz {
  id: number;
  path: string;
  title: string;
  desc?: string;
  cover_path: string;
  quizzes: Quiz[];
}

export interface UserAnswer {
  id_user: number;
  id_question: number;
  id_answer_option: number;
  date_answer: Date;
}
