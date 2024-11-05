--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-11-04 15:24:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4940 (class 0 OID 19633)
-- Dependencies: 215
-- Data for Name: answers_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.answers_options VALUES (74, 34, 'L''élégance et le luxe à la française', false);
INSERT INTO public.answers_options VALUES (75, 34, 'Effortless chic parisien', true);
INSERT INTO public.answers_options VALUES (76, 34, 'Pur et élégant', true);
INSERT INTO public.answers_options VALUES (77, 34, 'Tendance street-wear', false);
INSERT INTO public.answers_options VALUES (78, 35, 'Le pont inversé', true);
INSERT INTO public.answers_options VALUES (79, 35, 'Le pont retourné', false);
INSERT INTO public.answers_options VALUES (80, 36, 'La charnière harpon', true);
INSERT INTO public.answers_options VALUES (81, 36, 'La charnière flex', false);
INSERT INTO public.answers_options VALUES (82, 37, 'Branche droite', true);
INSERT INTO public.answers_options VALUES (83, 37, 'Branche gauche', false);
INSERT INTO public.answers_options VALUES (84, 38, 'Veronika', false);
INSERT INTO public.answers_options VALUES (85, 38, 'Germaine', true);
INSERT INTO public.answers_options VALUES (86, 38, 'Mélody', false);
INSERT INTO public.answers_options VALUES (87, 39, 'Clara', false);
INSERT INTO public.answers_options VALUES (88, 39, 'Joséphine Bäumer', false);
INSERT INTO public.answers_options VALUES (89, 39, 'Mélody', true);
INSERT INTO public.answers_options VALUES (90, 40, 'Monsieur Blanc', true);
INSERT INTO public.answers_options VALUES (91, 40, 'Camélia', false);
INSERT INTO public.answers_options VALUES (92, 40, 'Aristide', false);
INSERT INTO public.answers_options VALUES (93, 41, 'Suzanne', false);
INSERT INTO public.answers_options VALUES (94, 41, 'Camélia', true);
INSERT INTO public.answers_options VALUES (95, 41, 'Clara', false);
INSERT INTO public.answers_options VALUES (96, 42, 'Bois, lin, bambou', false);
INSERT INTO public.answers_options VALUES (97, 42, 'Acétate de cellulose, fleur de coton, algues', true);
INSERT INTO public.answers_options VALUES (98, 42, 'Métal, soie, acétate de cellulose', false);
INSERT INTO public.answers_options VALUES (99, 43, 'Parce qu''il est bon marché', false);
INSERT INTO public.answers_options VALUES (100, 43, 'En raison de sa solidité et de son hypoallergénicité', true);
INSERT INTO public.answers_options VALUES (101, 43, 'Parce qu''il est coloré', false);
INSERT INTO public.answers_options VALUES (102, 44, 'Acier inoxydable et argent', false);
INSERT INTO public.answers_options VALUES (103, 44, 'Acier inoxydable et or 22 carats', true);
INSERT INTO public.answers_options VALUES (104, 44, 'Aluminium et or 18 carats', false);
INSERT INTO public.answers_options VALUES (105, 45, 'Polissage manuel', false);
INSERT INTO public.answers_options VALUES (106, 45, 'Traitement galvanique', false);
INSERT INTO public.answers_options VALUES (107, 45, 'Bain chimique', true);
INSERT INTO public.answers_options VALUES (108, 46, 'Augmenter la flexibilité des montures', false);
INSERT INTO public.answers_options VALUES (109, 46, 'Créer une finition luxueuse et durable', true);
INSERT INTO public.answers_options VALUES (110, 46, 'Améliorer la transparence du matériau', false);
INSERT INTO public.answers_options VALUES (113, 47, 'Japon', false);
INSERT INTO public.answers_options VALUES (114, 47, 'États-Unis', false);
INSERT INTO public.answers_options VALUES (115, 47, 'Italie', true);
INSERT INTO public.answers_options VALUES (116, 49, 'Leur aspect industriel brut et sans finition', false);
INSERT INTO public.answers_options VALUES (117, 49, 'La présence d''un logo sur les charnières, accompagné d’une fine couche de laque délicatement déposée', true);
INSERT INTO public.answers_options VALUES (118, 49, 'Leur structure en bois massif non traité', false);
INSERT INTO public.answers_options VALUES (119, 49, 'Leur design minimaliste sans ornements ni finitions', false);


--
-- TOC entry 4942 (class 0 OID 19639)
-- Dependencies: 217
-- Data for Name: formations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.formations VALUES (35, 'L''ADN de la marque', NULL, 'IMG1.jpg', true);
INSERT INTO public.formations VALUES (36, 'Les matériaux Maison Nathalie Blanc', NULL, 'IMG2.jpg', true);


--
-- TOC entry 4944 (class 0 OID 19645)
-- Dependencies: 219
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.modules VALUES (75, 35, 'Le style Maison Nathalie Blanc', NULL);
INSERT INTO public.modules VALUES (76, 35, 'Les signatures de Maison Nathalie Blanc', NULL);
INSERT INTO public.modules VALUES (77, 35, 'Les modèles iconiques', NULL);
INSERT INTO public.modules VALUES (78, 36, 'Matière acétate', NULL);
INSERT INTO public.modules VALUES (79, 36, 'Matière métal', NULL);


--
-- TOC entry 4961 (class 0 OID 19850)
-- Dependencies: 236
-- Data for Name: photo_text; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.photo_text VALUES (17, 76, 'Cours 2', NULL, 'adn-content-2.jpg', '<p>Les signatures de Maison Nathalie Blanc se manifestent à travers plusieurs éléments
distinctifs.</p><br/>
<p>Tout d''abord, ses designs épurés et élégants, qui allient finesse et modernité.
Mais aussi le détail apporté sur ses montures iconiques qui est le pont inversé, un détail
distinctif qui allie élégance et modernité.</p>
<p>Pour la collection Monsieur Blanc, nous innovons avec la charnière brevetée Harpon, un
élément de design unique qui assure à la fois robustesse et sophistication. Ces touches exclusives incarnent parfaitement notre engagement envers l''excellence et le style intemporel.</p><br/>
<p>Nathalie Blanc inclut également des détails méticuleux tels que le manchon troué dans la
branche droite, son logo sur les nouvelles charnières accompagnées d’une fine couche de
laque délicatement déposée ou encore une armature présente dans les branches de
certains modèles, dont les motifs ont été dessinés par la créatrice.</p>
<p>Ces caractéristiques subtiles mais distinctives témoignent de l''attention portée aux finitions.</p><br/>
<p>Les charnières, quant à elles, sont fabriquées en maillechort, un alliage métallique résistant
à la corrosion. Ces charnières assurent une ouverture et une fermeture fluides des
branches, tout en maintenant solidement les différentes parties de nos montures ensemble.</p>
<p>Grâce à leur durabilité, les charnières en maillechort garantissent une longue vie à nos
montures, même face à une utilisation quotidienne intensive.</p>');
INSERT INTO public.photo_text VALUES (16, 75, 'Cours 1', NULL, 'adn-content-1.jpg', '<p>Toutes les créations de Nathalie incarnent parfaitement le "French effortless chic" et
sont décrites comme des formes pures, avec un soin particulier apporté à chaque
détail.</p> <br/>
<p>Reflétant ainsi la sophistication intemporelle de Paris, où chaque détail est
pensé pour allier confort et raffinement, offrant ainsi des pièces uniques qui
incarnent l’essence même du chic parisien.</p>');
INSERT INTO public.photo_text VALUES (18, 77, 'Cours 3', NULL, 'adn-content-3.jpg', '<p><b>La Maison Nathalie Blanc est fière de ses modèles iconiques, chacun portant une histoire unique et une touche de sophistication.</b></p><br/><br/>
<p><b>Germaine : </b>Nommée en hommage à la grand-mère de la créatrice, ce modèle se distingue par sa branche inversée, symbole de l''élégance intemporelle.</p><br/>
<p><b>Veronika : </b>Résultat d''une sublime collaboration avec Veronika Loubry, ce modèle incarne le raffinement et le style à la parisienne.</p><br/>
<p><b>Mélody : </b>Créée pour la célèbre chanteuse de jazz Mélody Gardot, cette monture est le fruit d''une collaboration artistique exceptionnelle, alliant musique et design.</p><br/>
<p><b>Monsieur Blanc : </b>La première monture conçue pour les hommes, marquant l''extension de notre collection avec une touche de masculinité raffinée.</p><br/>
<p><b>Camélia : </b>Inspirée par Janis Joplin, icône des années 1960, cette monture en forme de fleur célèbre l''esprit libre et audacieux de la chanteuse.</p><br/>
<p><b>Aristide : </b>Un classique du monde de la lunette avec une forme pantos qui adoucit tous les visages. Le guillochage sur le nez, conçu spécialement par la Maison Nathalie Blanc, apporte un aspect japonais et artisanal.</p><br/>
<p><b>Clara : </b>Notre Clara qui a reçu le prix Vision Expo en 2020, cette monture se distingue par sa plaque d''acétate de 10 mm, alliant robustesse et élégance.</p><br/>
<p><b>Suzanne : </b>L''une des premières montures dessinées avec le pont inversé, signature de la maison, incarnant parfaitement notre vision de l''élégance contemporaine.</p><br/>
<p><b>Joséphine Bäumer : </b>Un modèle iconique en métal à la forme carrée, parée désormais du célèbre battement de cœur en diamants de Lorenz Bäumer, rehaussé par notre pont inversé signature.</p><br/>');
INSERT INTO public.photo_text VALUES (19, 78, 'Cours 1', NULL, 'materiaux-content-1.jpg', '<p>Nathalie Blanc s''associe à Mazzucchelli, provenant d''Italie, pour créer des collections artisanales en acétate, révélant des strates de profondeur grâce aux matériaux les plus nobles de l''optique. Conçues à partir d''acétate de cellulose, de fleur de coton et d''algues, ces pièces reflètent un savoir-faire exceptionnel.</p><br/> 
<p>L''acétate de cellulose, un plastique végétal organique et recyclable, est hypoallergénique et a été adopté pour la fabrication de lunettes depuis la fin des années 1940, en réponse aux limitations des plastiques antérieurs.</p><br/>
<p>Aujourd''hui, les acétates se distinguent par leur qualité incomparable et leur beauté époustouflante, souvent bonifiés par un vieillissement de plus de trente ans pour une robustesse accrue.</p>');
INSERT INTO public.photo_text VALUES (20, 79, 'Cours 2', NULL, 'materiaux-content-2.jpg', '<p>Nos montures en métal allient harmonieusement acier inoxydable et or 22 carats pour une
combinaison de robustesse et d''élégance. La face et les branches, façonnées en acier
inoxydable, offrent une base solide.</p><br/>
<p>Le traitement galvanique en plusieurs étapes crée une finition luxueuse et durable. Les
montures sont immergées dans un bain d''or 22 carats, où des courants électriques déposent
les métaux précieux, garantissant une application uniforme.</p><br/>
<p>Les montures comportent plusieurs couches pour une résistance optimale : une première
couche de palladium, suivie d''une couche d''or 22 carats, et deux couches de vernis époxy
pour protéger la finition et assurer sa longévité.</p><br/><br/>

<p>Notre alliage d''or 22 carats, comprenant deux grammes d''or pur et d''autres métaux
précieux, garantit une esthétique exceptionnelle et une durabilité accrue, offrant des
accessoires de choix alliant style et qualité.</p>');


--
-- TOC entry 4946 (class 0 OID 19651)
-- Dependencies: 221
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.questions VALUES (34, 32, 'Comment définir le style Maison Nathalie Blanc ?', NULL, true);
INSERT INTO public.questions VALUES (35, 33, 'Comment s''appelle le pont iconique de la créatrice Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions VALUES (36, 33, 'Comment appelle-t-on la charnière brevetée de la collection Monsieur Blanc ?', NULL, false);
INSERT INTO public.questions VALUES (37, 33, 'De quel côté apparaît le manchon troué ?', NULL, false);
INSERT INTO public.questions VALUES (38, 34, 'Quel modèle porte le nom de la grand-mère de la créatrice et se distingue par sa branche inversée ?', NULL, false);
INSERT INTO public.questions VALUES (39, 34, 'Quel modèle a été créé pour une célèbre chanteuse de jazz ?', NULL, false);
INSERT INTO public.questions VALUES (40, 34, 'Quelle est la première monture conçue pour les hommes, marquant une extension de notre collection ?', NULL, false);
INSERT INTO public.questions VALUES (41, 34, 'Quelle monture, inspirée par Janis Joplin, est en forme de fleur et célèbre l''esprit libre de la chanteuse ?', NULL, false);
INSERT INTO public.questions VALUES (42, 35, 'Quels matériaux naturels sont utilisés dans les montures en acétate de Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions VALUES (43, 35, 'Pourquoi l''acétate de cellulose est-il préféré pour la fabrication de lunettes depuis la fin des années 1940 ?', NULL, false);
INSERT INTO public.questions VALUES (44, 36, 'Quels matériaux sont utilisés pour créer la base des montures métalliques de Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions VALUES (45, 36, 'Quel est le processus utilisé pour appliquer l''or 22 carats sur les montures métalliques ?', NULL, false);
INSERT INTO public.questions VALUES (46, 36, 'Quel est le rôle du traitement galvanique dans la fabrication des montures métalliques ?', NULL, false);
INSERT INTO public.questions VALUES (47, 35, 'D''où provient l''acétate Mazzucchelli ?', NULL, false);
INSERT INTO public.questions VALUES (49, 33, 'Qu''est-ce qui caractérise les nouvelles charnières mises en avant par la marque ?', NULL, false);


--
-- TOC entry 4948 (class 0 OID 19657)
-- Dependencies: 223
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.quiz VALUES (32, 75, 'Quiz');
INSERT INTO public.quiz VALUES (33, 76, 'Quiz');
INSERT INTO public.quiz VALUES (34, 77, 'Quiz');
INSERT INTO public.quiz VALUES (35, 78, 'Quiz');
INSERT INTO public.quiz VALUES (36, 79, 'Quiz');


--
-- TOC entry 4950 (class 0 OID 19661)
-- Dependencies: 225
-- Data for Name: texts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4952 (class 0 OID 19667)
-- Dependencies: 227
-- Data for Name: user_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_answers VALUES (37, 2, 32, 34, 75, '2024-07-29 15:03:03', true);
INSERT INTO public.user_answers VALUES (38, 2, 32, 34, 76, '2024-07-29 15:03:08', true);
INSERT INTO public.user_answers VALUES (39, 2, 33, 36, 80, '2024-07-29 15:05:10', true);
INSERT INTO public.user_answers VALUES (40, 2, 33, 35, 78, '2024-07-29 15:05:07', true);
INSERT INTO public.user_answers VALUES (41, 2, 33, 37, 82, '2024-07-29 15:05:16', true);
INSERT INTO public.user_answers VALUES (42, 2, 34, 39, 89, '2024-07-29 15:08:27', true);
INSERT INTO public.user_answers VALUES (43, 2, 34, 38, 85, '2024-07-29 15:08:23', true);
INSERT INTO public.user_answers VALUES (44, 2, 34, 40, 90, '2024-07-29 15:08:29', true);
INSERT INTO public.user_answers VALUES (45, 2, 34, 41, 94, '2024-07-29 15:08:33', true);
INSERT INTO public.user_answers VALUES (46, 2, 35, 43, 100, '2024-07-29 15:10:45', true);
INSERT INTO public.user_answers VALUES (47, 2, 35, 42, 97, '2024-07-29 15:10:38', true);
INSERT INTO public.user_answers VALUES (51, 2, 36, 44, 103, '2024-07-29 15:11:49', true);
INSERT INTO public.user_answers VALUES (52, 2, 36, 45, 107, '2024-07-29 15:11:46', true);
INSERT INTO public.user_answers VALUES (53, 2, 36, 46, 109, '2024-07-29 15:11:52', true);
INSERT INTO public.user_answers VALUES (125, 1, 32, 34, 75, '2024-10-28 15:35:46', true);
INSERT INTO public.user_answers VALUES (126, 1, 32, 34, 76, '2024-10-28 15:35:50', true);
INSERT INTO public.user_answers VALUES (127, 1, 33, 35, 78, '2024-10-28 15:36:20', true);
INSERT INTO public.user_answers VALUES (128, 1, 33, 36, 80, '2024-10-28 15:36:23', true);
INSERT INTO public.user_answers VALUES (129, 1, 33, 37, 82, '2024-10-28 15:36:25', true);
INSERT INTO public.user_answers VALUES (130, 1, 33, 49, 117, '2024-10-28 15:36:31', true);
INSERT INTO public.user_answers VALUES (131, 1, 34, 38, 85, '2024-10-28 15:37:38', true);
INSERT INTO public.user_answers VALUES (132, 1, 34, 39, 89, '2024-10-28 15:37:46', true);
INSERT INTO public.user_answers VALUES (133, 1, 34, 40, 90, '2024-10-28 15:37:50', true);
INSERT INTO public.user_answers VALUES (134, 1, 34, 41, 94, '2024-10-28 15:37:54', true);


--
-- TOC entry 4954 (class 0 OID 19671)
-- Dependencies: 229
-- Data for Name: user_progression; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_progression VALUES (91, 2, 35, 75, NULL, NULL, NULL, true, 16);
INSERT INTO public.user_progression VALUES (92, 2, 35, 75, NULL, NULL, 32, true, NULL);
INSERT INTO public.user_progression VALUES (93, 2, 35, 76, NULL, NULL, NULL, true, 17);
INSERT INTO public.user_progression VALUES (94, 2, 35, 76, NULL, NULL, 33, true, NULL);
INSERT INTO public.user_progression VALUES (95, 2, 35, 77, NULL, NULL, NULL, true, 18);
INSERT INTO public.user_progression VALUES (96, 2, 35, 77, NULL, NULL, 34, true, NULL);
INSERT INTO public.user_progression VALUES (97, 2, 36, 78, NULL, NULL, NULL, true, 19);
INSERT INTO public.user_progression VALUES (98, 2, 36, 78, NULL, NULL, 35, true, NULL);
INSERT INTO public.user_progression VALUES (99, 2, 36, 79, NULL, NULL, NULL, true, 20);
INSERT INTO public.user_progression VALUES (101, 2, 36, 79, NULL, NULL, 36, true, NULL);
INSERT INTO public.user_progression VALUES (125, 1, 35, 75, NULL, NULL, NULL, true, 16);
INSERT INTO public.user_progression VALUES (129, 1, 35, 75, NULL, NULL, 32, true, NULL);
INSERT INTO public.user_progression VALUES (130, 1, 35, 76, NULL, NULL, 33, true, NULL);
INSERT INTO public.user_progression VALUES (131, 1, 35, 77, NULL, NULL, 34, true, NULL);
INSERT INTO public.user_progression VALUES (132, 1, 35, 76, NULL, NULL, NULL, true, 17);
INSERT INTO public.user_progression VALUES (133, 1, 35, 77, NULL, NULL, NULL, true, 18);


--
-- TOC entry 4956 (class 0 OID 19675)
-- Dependencies: 231
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'wins', 'wins', 'wins@admin.fr', '$argon2id$v=19$m=65536,t=3,p=4$cw1+NlKH/IlBZMq3f6u6Hg$/le2NsXt3HvvwT7VIWUzqk7pPO6uNOiVJMSla4/24UE', 'sadmin', '2024-06-03 13:32:57', NULL, NULL);
INSERT INTO public.users VALUES (2, 'test', 'un', 'test@un.fr', '$argon2id$v=19$m=65536,t=3,p=4$UBvfbrmSTnwA2wib0VYINA$JDwuPrIfVX/1mEr+kANTiVSM8C25b7g3u6xWQ0dlnhc', 'user', '2024-06-03 13:53:06', 'Edgard Caen', NULL);
INSERT INTO public.users VALUES (3, 'test', 'deux', 'test@deux.fr', '$argon2id$v=19$m=65536,t=3,p=4$T2+8ko1CZzzba4aKZPmyCw$75JLO7K30LH4oTlznGDsTija3YhQz4Kj4H71DbROZPE', 'user', '2024-06-03 13:53:30', 'Krys Boulogne', NULL);
INSERT INTO public.users VALUES (8, 'test', 'city', 'test@city.fr', '$argon2id$v=19$m=65536,t=3,p=4$MkUmSV/9xz5ZsaDSiX0bmA$FtFyhP4Vva1EYKL1Ecw577mYKR2vmtRuFq/mEI0R/WM', 'user', '2024-10-28 16:20:43', 'city mag', 'city city');


--
-- TOC entry 4958 (class 0 OID 19681)
-- Dependencies: 233
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 216
-- Name: answers_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.answers_options_id_seq', 119, true);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 218
-- Name: formations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formations_id_seq', 36, true);


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 220
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modules_id_seq', 79, true);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 235
-- Name: photo_text_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.photo_text_id_seq', 20, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 222
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 49, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 224
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_id_seq', 36, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 226
-- Name: texts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.texts_id_seq', 17, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 228
-- Name: user_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_answers_id_seq', 134, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_progression_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progression_id_seq', 133, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 234
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_id_seq', 15, true);


-- Completed on 2024-11-04 15:24:48

--
-- PostgreSQL database dump complete
--

