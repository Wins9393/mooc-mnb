export interface IdParams {
  id: number;
}

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
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOption[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

export interface QuizFromDB {
  quiz_id: number;
  quiz_title: string;
  question_id: number;
  question_text: string;
  explanation: string;
  is_multiple_choice: boolean;
  answer_option_id: number;
  answer_text: string;
  correct: boolean;
}

export interface BodyResetQuizById {
  id_user: number;
  id_quiz: number;
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

export interface FormationToDB {
  title: string;
  description?: string;
  cover_path: string;
}

export interface ModuleToDB {
  id_formation: number;
  title: string;
  description?: string;
}

export interface VideoToDB {
  id_module: number;
  path: string;
  title: string;
  description?: string;
  cover_path?: string;
}

export interface TextToDB {
  id_module: number;
  title: string;
  content: string;
}

export interface QuizToDB {
  id_module: number;
  title: string;
}

export interface QuestionToDB {
  id_quiz: number;
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
}

export interface AnswerOptionToDB {
  id_question: number;
  answer_text: string;
  correct: boolean;
}

// TMP
export interface CompleteFormationToDB {
  formation: FormationToDB;
  selectedFile: File;
  modules: ModuleFromFront[];
  videos: VideoFromFront[];
  texts: TextFromFront[];
  quizQuestionsAndAnswers: QuizQuestionsAndAnswersFromFront;
}

export interface QuizQuestionsAndAnswersFromFront {
  [key: string]: [
    {
      type: "quiz";
      quiz_title: string;
      questions: QuestionFromFront[];
    }
  ];
}

export interface ModuleFromFront {
  type: "module";
  id_formation: number | null;
  title: string;
  description?: string;
}

export interface VideoFromFront {
  type: "video";
  key: string | null;
  id_module: number | null;
  path: string;
  title: string;
  description?: string;
  cover_path?: string;
  video: File[];
}

export interface TextFromFront {
  type: "text";
  key: string | null;
  id_module: number | null;
  title: string;
  content: string;
}

export interface QuestionFromFront {
  type: "question";
  id_quiz: number | null;
  question_text: string;
  explanation?: string;
  is_multiple_choice: boolean;
  answer_options: AnswerOptionFromFront[];
}

export interface AnswerOptionFromFront {
  type: "answeroption";
  key: number | null;
  id_question: number | null;
  answer_text: string;
  correct: boolean;
}

// export interface MediaFile {
//   lastModified: number;
//   name: string;
//   size: number;
//   type: string;
//   uid: string;
// }
// TMP
