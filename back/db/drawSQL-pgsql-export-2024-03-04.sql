CREATE TABLE "user_answers"(
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "id_answer_option" INTEGER NOT NULL,
    "date_answer" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "user_answers" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "questions"(
    "id" SERIAL NOT NULL,
    "id_quiz" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "explanation" TEXT NULL
);
ALTER TABLE
    "questions" ADD PRIMARY KEY("id");
CREATE TABLE "formations"(
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "desc" TEXT NULL,
    "cover_path" VARCHAR(255) NULL
);
ALTER TABLE
    "formations" ADD PRIMARY KEY("id");
CREATE TABLE "quiz"(
    "id" SERIAL NOT NULL,
    "id_video" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "quiz" ADD PRIMARY KEY("id");
CREATE TABLE "answers_options"(
    "id" SERIAL NOT NULL,
    "id_question" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL
);
ALTER TABLE
    "answers_options" ADD PRIMARY KEY("id");
CREATE TABLE "videos"(
    "id" SERIAL NOT NULL,
    "id_formation" INTEGER NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "desc" TEXT NULL,
    "cover_path" VARCHAR(255) NULL
);
ALTER TABLE
    "videos" ADD PRIMARY KEY("id");
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_user_foreign" FOREIGN KEY("id_user") REFERENCES "users"("id");
ALTER TABLE
    "questions" ADD CONSTRAINT "questions_id_quiz_foreign" FOREIGN KEY("id_quiz") REFERENCES "quiz"("id");
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_answer_option_foreign" FOREIGN KEY("id_answer_option") REFERENCES "answers_options"("id");
ALTER TABLE
    "quiz" ADD CONSTRAINT "quiz_id_video_foreign" FOREIGN KEY("id_video") REFERENCES "videos"("id");
ALTER TABLE
    "user_answers" ADD CONSTRAINT "user_answers_id_question_foreign" FOREIGN KEY("id_question") REFERENCES "questions"("id");
ALTER TABLE
    "answers_options" ADD CONSTRAINT "answers_options_id_question_foreign" FOREIGN KEY("id_question") REFERENCES "questions"("id");
ALTER TABLE
    "videos" ADD CONSTRAINT "videos_id_formation_foreign" FOREIGN KEY("id_formation") REFERENCES "formations"("id");

INSERT INTO "formations" (title, "desc", cover_path) VALUES ('Apprendre à connaitre la Maison Nathalie Blanc', 'Quelques vidéos pour mieux connaitre les marques de Maison Nathalie Blanc et la créatrice', 'formation-1-cover.jpg'), ('Apprendre à connaitre la Maison Nathalie Blanc', 'Quelques vidéos pour mieux connaitre les marques de Maison Nathalie Blanc et la créatrice', 'formation-1-cover.jpg'), ('Apprendre à connaitre la Maison Nathalie Blanc', 'Quelques vidéos pour mieux connaitre les marques de Maison Nathalie Blanc et la créatrice', 'formation-1-cover.jpg'), ('Apprendre à connaitre la Maison Nathalie Blanc', 'Quelques vidéos pour mieux connaitre les marques de Maison Nathalie Blanc et la créatrice', 'formation-1-cover.jpg');
INSERT INTO "videos" (id_formation, path, title, "desc", cover_path) VALUES (1, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (1, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (2, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (2, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (3, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (3, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (4, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (4, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (5, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (5, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (6, '1.mp4', 'Première vidéo', 'Une super vidéo explicative', 'video-1-cover.jpg'), (6, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg'), (7, '2.mp4', 'Deuxième vidéo', 'Une super vidéo explicative, encore une fois', 'video-2-cover.jpg');
INSERT INTO "quiz" (id_video, title) VALUES (3, 'Quiz de la troisième vidéo'), (4, 'Quiz de la quatrième vidéo'), (5, 'Quiz de la cinquième vidéo'), (6, 'Quiz de la sixième vidéo'), (7, 'Quiz de la septième vidéo');
INSERT INTO "questions" (id_quiz, question_text, explanation) VALUES (3, 'Quelle est la montagne sur cette vidéo ?', ''), (4, 'Quelle est la ville sur cette vidéo ?', ''), (5, 'Quelle est la montagne sur cette vidéo ?', ''), (6, 'Quelle est la ville sur cette vidéo ?', ''), (7, 'Quelle est la ville sur cette vidéo ?', '');
INSERT INTO "answers_options" (id_question, answer_text, correct) VALUES (1, 'Le mont Fuji', 'true'), (1, 'Le mont Blanc', 'false'), (1, 'Le mont Everest', 'false'), (1, 'Le Kilimanjaro', 'false'), (2, 'Marseille', 'false'), (2, 'Tokyo', 'false'), (2, 'Paris', 'true'), (2, 'New-York', 'false'), (3, 'Le mont Fuji', 'true'), (3, 'Le mont Blanc', 'false'), (3, 'Le mont Everest', 'false'), (3, 'Le Kilimanjaro', 'false'), (4, 'Marseille', 'false'), (4, 'Tokyo', 'false'), (4, 'Paris', 'true'), (4, 'New-York', 'false'), (5, 'Le mont Fuji', 'true'), (5, 'Le mont Blanc', 'false'), (5, 'Le mont Everest', 'false'), (5, 'Le Kilimanjaro', 'false'), (6, 'Marseille', 'false'), (6, 'Tokyo', 'false'), (6, 'Paris', 'true'), (6, 'New-York', 'false'), (7, 'Marseille', 'false'), (7, 'Tokyo', 'false'), (7, 'Paris', 'true'), (7, 'New-York', 'false');