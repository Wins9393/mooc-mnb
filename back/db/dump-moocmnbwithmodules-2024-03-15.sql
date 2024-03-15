CREATE TABLE "formations"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "cover_path" VARCHAR(255) NULL
);
CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
CREATE TABLE "modules"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_formation" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NULL
);
CREATE TABLE "videos"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_module" INTEGER NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "cover_path" VARCHAR(255) NULL
);
CREATE TABLE "answers_options"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_question" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL
);
CREATE TABLE "questions"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_quiz" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "explanation" TEXT NULL,
    "is_multiple_choice" BOOLEAN NOT NULL
);
CREATE TABLE "user_answers"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "id_answer_option" INTEGER NOT NULL,
    "date_answer" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
CREATE TABLE "texts"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_module" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL
);
CREATE TABLE "quiz"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "id_module" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_answer_option_foreign" FOREIGN KEY("id_answer_option") REFERENCES "answers_options"("id");
ALTER TABLE
    "answers_options" ADD CONSTRAINT "answers_options_id_question_foreign" FOREIGN KEY("id_question") REFERENCES "questions"("id");
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_question_foreign" FOREIGN KEY("id_question") REFERENCES "questions"("id");
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "users"("id");
ALTER TABLE
    "videos" ADD CONSTRAINT "videos_id_module_foreign" FOREIGN KEY("id_module") REFERENCES "modules"("id");
ALTER TABLE
    "quiz" ADD CONSTRAINT "quiz_id_module_foreign" FOREIGN KEY("id_module") REFERENCES "modules"("id");
ALTER TABLE
    "texts" ADD CONSTRAINT "texts_id_module_foreign" FOREIGN KEY("id_module") REFERENCES "modules"("id");
ALTER TABLE
    "questions" ADD CONSTRAINT "questions_id_quiz_foreign" FOREIGN KEY("id_quiz") REFERENCES "quiz"("id");
ALTER TABLE
    "modules" ADD CONSTRAINT "modules_id_formation_foreign" FOREIGN KEY("id_formation") REFERENCES "formations"("id");