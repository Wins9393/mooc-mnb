import { UploadFile } from "antd";

export type ContentType =
  | Formation
  | Module
  | Video
  | Text
  | PhotoText
  | Quiz
  | QuestionFromDB
  | AnswerOption;

export interface Formation {
  id: number;
  title: string;
  description?: string;
  cover_path: string;
  published: boolean;
  modules: Module[];
}

export interface FormationToDB {
  type: "formation";
  title: string;
  description?: string;
  cover_path: string;
  published: boolean;
}

export interface Module {
  id: number;
  id_formation: number;
  title: string;
  description: string;
}

export interface ModuleToDB {
  type: "module";
  id_formation: number | null;
  title: string;
  description?: string;
}

export interface Video {
  id_video: number;
  path_video: string;
  title_video: string;
  description_video: string;
  cover_path_video: string;
}

export interface VideoToDB {
  type: "video";
  key: string | null;
  id_module: number | null;
  path: string;
  title: string;
  description?: string;
  cover_path?: string;
  video: UploadFile[];
}

export interface Text {
  id_text: number;
  title_text: string;
  content_text: string;
}

export interface TextToDB {
  type: "text";
  key: string | null;
  id_module: number | null;
  title: string;
  content: string;
}

export interface PhotoText {
  id_photo_text: number;
  title_photo_text: string;
  description_photo_text: string;
  text_content_photo_text: string;
  photo_path_photo_text: string;
}

export interface PhotoTextToDB {
  type: "photo_text";
  key: string | null;
  id_module: number | null;
  title: string;
  description?: string;
  text_content: string;
  photo_path: string;
  photo: UploadFile[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface QuizToDB {
  type: "quiz";
  id_module: number | null;
  title: string;
}

export interface ModuleCollapseItem {
  id: string;
  title: string;
  type: string;
  item: Video | Text | Quiz | PhotoText | null;
}

export interface Question {
  id: number;
  id_quiz: number | null;
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOption[];
}

export interface QuestionFromDB {
  id: number;
  id_quiz: number | null;
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
}

export interface QuestionToDB {
  type: "question";
  id_quiz: number | null;
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOptionToDB[];
}

export interface AnswerOption {
  id: number;
  text: string;
}

export interface AnswerOptionToDB {
  type: "answeroption";
  key: number | null;
  id_question: number | null;
  answer_text: string;
  correct: boolean;
}

export interface ContentByModule {
  id: number;
  videos: Video[];
  texts: Text[];
  photos_texts: PhotoText[];
}

// export interface QuizByModule {
//   id: number;
//   title: string;
//   questions: Question[];
// }

export interface FormationItemProps {
  formation: Formation;
}

export interface UserAnswer {
  id_user: number;
  id_question: number;
  id_answer_option: number;
  date_answer: string;
  id_quiz: number;
  correct: boolean;
}

export interface UserAnswerWithoutCorrect {
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
  idAnswerOptionSelected: number | number[];
  correctAnswer: FullAnswerOption | FullAnswerOption[];
}

export interface QuizQuestionsAndAnswersContent {
  [key: string]: [
    {
      type: "quiz";
      quiz_title: string;
      questions: QuestionToDB[];
    }
  ];
}

export interface UserProgression {
  id_user: number;
  id_formation: number;
  id_module: number;
  id_video?: number;
  id_text?: number;
  id_photo_text?: number;
  id_quiz?: number;
  complete: boolean;
}

export interface ContentsByFormation {
  formation_id: number;
  formation_title: string;
  video_count: number;
  text_count: number;
  photo_text_count: number;
  quiz_count: number;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  shop: string;
  email: string;
  role: string;
  createdAt: string;
}
