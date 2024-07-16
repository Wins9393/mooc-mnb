import {
  AnswerOption,
  ContentType,
  Formation,
  Module,
  PhotoText,
  QuestionFromDB,
  Quiz,
  Text,
  Video,
} from "../types/types";

// TypeGuard for Content
export function isFormation(content: ContentType): content is Formation {
  return (content as Formation).cover_path !== undefined;
}

export function isModule(content: ContentType): content is Module {
  return (content as Module).id_formation !== undefined;
}

export function isVideo(content: ContentType): content is Video {
  return (content as Video).title_video !== undefined;
}

export function isText(content: ContentType): content is Text {
  return (content as Text).title_text !== undefined;
}

export function isPhotoText(content: ContentType): content is PhotoText {
  return (content as PhotoText).title_photo_text !== undefined;
}

export function isQuiz(content: ContentType): content is Quiz {
  return (content as Quiz).questions !== undefined;
}

export function isQuestion(content: ContentType): content is QuestionFromDB {
  return (content as QuestionFromDB).question_text !== undefined;
}

export function isAnswerOption(content: ContentType): content is AnswerOption {
  return (content as AnswerOption).text !== undefined;
}

export function getContentType(content: ContentType) {
  if (isFormation(content)) {
    return content as Formation;
  }
  if (isModule(content)) {
    return content as Module;
  }
  if (isVideo(content)) {
    return content as Video;
  }
  if (isText(content)) {
    return content as Text;
  }
  if (isPhotoText(content)) {
    return content as PhotoText;
  }
  if (isQuiz(content)) {
    return content as Quiz;
  }
  if (isQuestion(content)) {
    return content as QuestionFromDB;
  }
  if (isAnswerOption(content)) {
    return content as AnswerOption;
  }
}
