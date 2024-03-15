-- Insertion dans la table formations
INSERT INTO "formations" ("title", "description", "cover_path") VALUES
('Formation 1', 'Description de la Formation 1', 'formation-1-cover.jpg'),
('Formation 2', 'Description de la Formation 2', 'formation-2-cover.jpg');

-- Insertion dans la table modules
INSERT INTO "modules" ("id_formation", "title", "description") VALUES
(1, 'Module 1 de la Formation 1', 'Description du Module 1'),
(1, 'Module 2 de la Formation 1', 'Description du Module 2'),
(1, 'Module 3 de la Formation 1', 'Description du Module 3'),
(2, 'Module 1 de la Formation 2', 'Description du Module 1'),
(2, 'Module 2 de la Formation 2', 'Description du Module 2'),
(2, 'Module 3 de la Formation 2', 'Description du Module 3');

-- Insertion dans la table videos
INSERT INTO "videos" ("id_module", "path", "title", "description", "cover_path") VALUES
(1, '1.mp4', 'Vidéo 1 Module 1', 'Description de la vidéo 1', 'video-1-cover.jpg'),
(1, '2.mp4', 'Vidéo 2 Module 1', 'Description de la vidéo 2', 'video-2-cover.jpg'),
(2, '3.mp4', 'Vidéo 1 Module 2', 'Description de la vidéo 1', 'video-3-cover.jpg'),
(2, '4.mp4', 'Vidéo 2 Module 2', 'Description de la vidéo 2', 'video-4-cover.jpg'),
(3, '5.mp4', 'Vidéo 1 Module 3', 'Description de la vidéo 1', 'video-5-cover.jpg'),
(3, '6.mp4', 'Vidéo 2 Module 3', 'Description de la vidéo 2', 'video-6-cover.jpg'),
(4, '7.mp4', 'Vidéo 1 Module 1 Formation 2', 'Description de la vidéo 1', 'video-7-cover.jpg'),
(4, '8.mp4', 'Vidéo 2 Module 1 Formation 2', 'Description de la vidéo 2', 'video-8-cover.jpg'),
(5, '9.mp4', 'Vidéo 1 Module 2 Formation 2', 'Description de la vidéo 1', 'video-9-cover.jpg'),
(5, '10.mp4', 'Vidéo 2 Module 2 Formation 2', 'Description de la vidéo 2', 'video-10-cover.jpg'),
(6, '11.mp4', 'Vidéo 1 Module 3 Formation 2', 'Description de la vidéo 1', 'video-11-cover.jpg'),
(6, '12.mp4', 'Vidéo 2 Module 3 Formation 2', 'Description de la vidéo 2', 'video-12-cover.jpg');

-- Insertion dans la table texts
-- Supposons que les ID des modules commencent à 1 et augmentent de manière séquentielle
INSERT INTO "texts" ("id_module", "title", "content") VALUES
(1, 'Texte du Module 1', 'Contenu du texte pour le Module 1'),
(2, 'Texte du Module 2', 'Contenu du texte pour le Module 2'),
(3, 'Texte du Module 3', 'Contenu du texte pour le Module 3'),
(4, 'Texte du Module 1 Formation 2', 'Contenu du texte pour le Module 1 de la Formation 2'),
(5, 'Texte du Module 2 Formation 2', 'Contenu du texte pour le Module 2 de la Formation 2'),
(6, 'Texte du Module 3 Formation 2', 'Contenu du texte pour le Module 3 de la Formation 2');

-- Insertion dans la table quiz
INSERT INTO "quiz" ("id_module", "title") VALUES
(1, 'Quiz Module 1'),
(2, 'Quiz Module 2'),
(3, 'Quiz Module 3'),
(4, 'Quiz Module 1 Formation 2'),
(5, 'Quiz Module 2 Formation 2'),
(6, 'Quiz Module 3 Formation 2');

-- Insertion dans la table questions et answers_options
-- Supposons que les ID des quiz commencent à 1 et augmentent de manière séquentielle
-- Les titres des quiz et les ID réels devront être ajustés selon les valeurs réelles de votre DB
WITH questions_inserted AS (
    INSERT INTO "questions" ("id_quiz", "question_text", "explanation", "is_multiple_choice") VALUES
    (1, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (1, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (1, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (1, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true),
    (2, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (2, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (2, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (2, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true),
    (3, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (3, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (3, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (3, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true),
    (4, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (4, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (4, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (4, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true),
    (5, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (5, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (5, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (5, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true),
    (6, 'Quelle est la capital de la France ?', 'Paris est la capital', true),
    (6, 'Quelle est la capital de l''Italie ?', 'Rome est la capital', false),
    (6, 'Quelle est la capital de l''Espagne ?', 'Madrid est la capital', false),
    (6, 'Quelle est la capital de l''Allemagne ?', 'Berlin est la capital', true)
    RETURNING id, id_quiz
)
-- Insertion dans la table answers_options
-- Nous devons utiliser les ID des questions que nous venons d'insérer, donc cette partie est dynamique
INSERT INTO "answers_options" ("id_question", "answer_text", "correct") SELECT id, answer, (seq = 1) FROM (
  SELECT q.id, q.id_quiz, ans.answer, ans.seq
  FROM (VALUES
    (1, 'Paris', 1),
    (1, 'Lyon', 2),
    (1, 'Marseille', 3),
    (1, 'Nice', 4),
    (2, 'Rome', 1),
    (2, 'Milan', 2),
    (2, 'Naples', 3),
    (2, 'Turin', 4),
    (3, 'Madrid', 1),
    (3, 'Barcelone', 2),
    (3, 'Valence', 3),
    (3, 'Séville', 4),
    (4, 'Berlin', 1),
    (4, 'Hambourg', 2),
    (4, 'Munich', 3),
    (4, 'Cologne', 4)
  ) AS ans(seq, answer, question_order),
  questions_inserted q
  WHERE ans.question_order = q.id_quiz
) AS q_and_a;
