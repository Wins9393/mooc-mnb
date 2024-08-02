--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-08-02 14:37:04

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 19633)
-- Name: answers_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answers_options (
    id integer NOT NULL,
    id_question integer NOT NULL,
    answer_text text NOT NULL,
    correct boolean NOT NULL
);


ALTER TABLE public.answers_options OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 19638)
-- Name: answers_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.answers_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.answers_options_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 216
-- Name: answers_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answers_options_id_seq OWNED BY public.answers_options.id;


--
-- TOC entry 217 (class 1259 OID 19639)
-- Name: formations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formations (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    cover_path character varying(255),
    published boolean NOT NULL
);


ALTER TABLE public.formations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19644)
-- Name: formations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formations_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 218
-- Name: formations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formations_id_seq OWNED BY public.formations.id;


--
-- TOC entry 219 (class 1259 OID 19645)
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    id_formation integer NOT NULL,
    title character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19650)
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modules_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 220
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- TOC entry 236 (class 1259 OID 19850)
-- Name: photo_text; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photo_text (
    id integer NOT NULL,
    id_module integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    photo_path character varying(255) NOT NULL,
    text_content text NOT NULL
);


ALTER TABLE public.photo_text OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 19849)
-- Name: photo_text_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.photo_text_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_text_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 235
-- Name: photo_text_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.photo_text_id_seq OWNED BY public.photo_text.id;


--
-- TOC entry 221 (class 1259 OID 19651)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    id_quiz integer NOT NULL,
    question_text text NOT NULL,
    explanation text,
    is_multiple_choice boolean NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19656)
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 222
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 223 (class 1259 OID 19657)
-- Name: quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz (
    id integer NOT NULL,
    id_module integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.quiz OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19660)
-- Name: quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_id_seq OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 224
-- Name: quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_id_seq OWNED BY public.quiz.id;


--
-- TOC entry 225 (class 1259 OID 19661)
-- Name: texts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.texts (
    id integer NOT NULL,
    id_module integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL
);


ALTER TABLE public.texts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19666)
-- Name: texts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.texts_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 226
-- Name: texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.texts_id_seq OWNED BY public.texts.id;


--
-- TOC entry 227 (class 1259 OID 19667)
-- Name: user_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_answers (
    id integer NOT NULL,
    id_user integer NOT NULL,
    id_quiz integer NOT NULL,
    id_question integer NOT NULL,
    id_answer_option integer NOT NULL,
    date_answer timestamp(0) without time zone,
    correct boolean NOT NULL
);


ALTER TABLE public.user_answers OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 19670)
-- Name: user_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_answers_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 228
-- Name: user_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_answers_id_seq OWNED BY public.user_answers.id;


--
-- TOC entry 229 (class 1259 OID 19671)
-- Name: user_progression; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progression (
    id integer NOT NULL,
    id_user integer NOT NULL,
    id_formation integer NOT NULL,
    id_module integer NOT NULL,
    id_video integer,
    id_text integer,
    id_quiz integer,
    complete boolean NOT NULL,
    id_photo_text integer
);


ALTER TABLE public.user_progression OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 19674)
-- Name: user_progression_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_progression_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_progression_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_progression_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progression_id_seq OWNED BY public.user_progression.id;


--
-- TOC entry 231 (class 1259 OID 19675)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    shop character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 19680)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 233 (class 1259 OID 19681)
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    id_module integer NOT NULL,
    path character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    cover_path character varying(255)
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 19686)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 234
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 4738 (class 2604 OID 19687)
-- Name: answers_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options ALTER COLUMN id SET DEFAULT nextval('public.answers_options_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 19688)
-- Name: formations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations ALTER COLUMN id SET DEFAULT nextval('public.formations_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 19689)
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- TOC entry 4748 (class 2604 OID 19853)
-- Name: photo_text id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo_text ALTER COLUMN id SET DEFAULT nextval('public.photo_text_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 19690)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 19691)
-- Name: quiz id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz ALTER COLUMN id SET DEFAULT nextval('public.quiz_id_seq'::regclass);


--
-- TOC entry 4743 (class 2604 OID 19692)
-- Name: texts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts ALTER COLUMN id SET DEFAULT nextval('public.texts_id_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 19693)
-- Name: user_answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers ALTER COLUMN id SET DEFAULT nextval('public.user_answers_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 19694)
-- Name: user_progression id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression ALTER COLUMN id SET DEFAULT nextval('public.user_progression_id_seq'::regclass);


--
-- TOC entry 4746 (class 2604 OID 19695)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 19696)
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- TOC entry 4940 (class 0 OID 19633)
-- Dependencies: 215
-- Data for Name: answers_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (74, 34, 'L''élégance et le luxe à la française', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (75, 34, 'Effortless chic parisien', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (76, 34, 'Pur et élégant', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (77, 34, 'Tendance street-wear', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (78, 35, 'Le pont inversé', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (79, 35, 'Le pont retourné', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (80, 36, 'La charnière harpon', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (81, 36, 'La charnière flex', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (82, 37, 'Branche droite', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (83, 37, 'Branche gauche', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (84, 38, 'Veronika', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (85, 38, 'Germaine', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (86, 38, 'Mélody', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (87, 39, 'Clara', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (88, 39, 'Joséphine Bäumer', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (89, 39, 'Mélody', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (90, 40, 'Monsieur Blanc', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (91, 40, 'Camélia', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (92, 40, 'Aristide', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (93, 41, 'Suzanne', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (94, 41, 'Camélia', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (95, 41, 'Clara', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (96, 42, 'Bois, lin, bambou', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (97, 42, 'Acétate de cellulose, fleur de coton, algues', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (98, 42, 'Métal, soie, acétate de cellulose', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (99, 43, 'Parce qu''il est bon marché', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (100, 43, 'En raison de sa solidité et de son hypoallergénicité', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (101, 43, 'Parce qu''il est coloré', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (102, 44, 'Acier inoxydable et argent', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (103, 44, 'Acier inoxydable et or 22 carats', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (104, 44, 'Aluminium et or 18 carats', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (105, 45, 'Polissage manuel', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (106, 45, 'Traitement galvanique', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (107, 45, 'Bain chimique', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (108, 46, 'Augmenter la flexibilité des montures', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (109, 46, 'Créer une finition luxueuse et durable', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (110, 46, 'Améliorer la transparence du matériau', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (113, 47, 'Japon', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (114, 47, 'États-Unis', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (115, 47, 'Italie', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (116, 49, 'Leur aspect industriel brut et sans finition', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (117, 49, 'La présence d''un logo sur les charnières, accompagné d’une fine couche de laque délicatement déposée', true);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (118, 49, 'Leur structure en bois massif non traité', false);
INSERT INTO public.answers_options (id, id_question, answer_text, correct) VALUES (119, 49, 'Leur design minimaliste sans ornements ni finitions', false);


--
-- TOC entry 4942 (class 0 OID 19639)
-- Dependencies: 217
-- Data for Name: formations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.formations (id, title, description, cover_path, published) VALUES (35, 'L''ADN de la marque', NULL, 'IMG1.jpg', true);
INSERT INTO public.formations (id, title, description, cover_path, published) VALUES (36, 'Les matériaux Maison Nathalie Blanc', NULL, 'IMG2.jpg', true);


--
-- TOC entry 4944 (class 0 OID 19645)
-- Dependencies: 219
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.modules (id, id_formation, title, description) VALUES (75, 35, 'Le style Maison Nathalie Blanc', NULL);
INSERT INTO public.modules (id, id_formation, title, description) VALUES (76, 35, 'Les signatures de Maison Nathalie Blanc', NULL);
INSERT INTO public.modules (id, id_formation, title, description) VALUES (77, 35, 'Les modèles iconiques', NULL);
INSERT INTO public.modules (id, id_formation, title, description) VALUES (78, 36, 'Matière acétate', NULL);
INSERT INTO public.modules (id, id_formation, title, description) VALUES (79, 36, 'Matière métal', NULL);


--
-- TOC entry 4961 (class 0 OID 19850)
-- Dependencies: 236
-- Data for Name: photo_text; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.photo_text (id, id_module, title, description, photo_path, text_content) VALUES (17, 76, 'Cours 2', NULL, 'adn-content-2.jpg', '<p>Les signatures de Maison Nathalie Blanc se manifestent à travers plusieurs éléments
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
INSERT INTO public.photo_text (id, id_module, title, description, photo_path, text_content) VALUES (16, 75, 'Cours 1', NULL, 'adn-content-1.jpg', '<p>Toutes les créations de Nathalie incarnent parfaitement le "French effortless chic" et
sont décrites comme des formes pures, avec un soin particulier apporté à chaque
détail.</p> <br/>
<p>Reflétant ainsi la sophistication intemporelle de Paris, où chaque détail est
pensé pour allier confort et raffinement, offrant ainsi des pièces uniques qui
incarnent l’essence même du chic parisien.</p>');
INSERT INTO public.photo_text (id, id_module, title, description, photo_path, text_content) VALUES (18, 77, 'Cours 3', NULL, 'adn-content-3.jpg', '<p><b>La Maison Nathalie Blanc est fière de ses modèles iconiques, chacun portant une histoire unique et une touche de sophistication.</b></p><br/><br/>
<p><b>Germaine : </b>Nommée en hommage à la grand-mère de la créatrice, ce modèle se distingue par sa branche inversée, symbole de l''élégance intemporelle.</p><br/>
<p><b>Veronika : </b>Résultat d''une sublime collaboration avec Veronika Loubry, ce modèle incarne le raffinement et le style à la parisienne.</p><br/>
<p><b>Mélody : </b>Créée pour la célèbre chanteuse de jazz Mélody Gardot, cette monture est le fruit d''une collaboration artistique exceptionnelle, alliant musique et design.</p><br/>
<p><b>Monsieur Blanc : </b>La première monture conçue pour les hommes, marquant l''extension de notre collection avec une touche de masculinité raffinée.</p><br/>
<p><b>Camélia : </b>Inspirée par Janis Joplin, icône des années 1960, cette monture en forme de fleur célèbre l''esprit libre et audacieux de la chanteuse.</p><br/>
<p><b>Aristide : </b>Un classique du monde de la lunette avec une forme pantos qui adoucit tous les visages. Le guillochage sur le nez, conçu spécialement par la Maison Nathalie Blanc, apporte un aspect japonais et artisanal.</p><br/>
<p><b>Clara : </b>Notre Clara qui a reçu le prix Vision Expo en 2020, cette monture se distingue par sa plaque d''acétate de 10 mm, alliant robustesse et élégance.</p><br/>
<p><b>Suzanne : </b>L''une des premières montures dessinées avec le pont inversé, signature de la maison, incarnant parfaitement notre vision de l''élégance contemporaine.</p><br/>
<p><b>Joséphine Bäumer : </b>Un modèle iconique en métal à la forme carrée, parée désormais du célèbre battement de cœur en diamants de Lorenz Bäumer, rehaussé par notre pont inversé signature.</p><br/>');
INSERT INTO public.photo_text (id, id_module, title, description, photo_path, text_content) VALUES (19, 78, 'Cours 1', NULL, 'materiaux-content-1.jpg', '<p>Nathalie Blanc s''associe à Mazzucchelli, provenant d''Italie, pour créer des collections artisanales en acétate, révélant des strates de profondeur grâce aux matériaux les plus nobles de l''optique. Conçues à partir d''acétate de cellulose, de fleur de coton et d''algues, ces pièces reflètent un savoir-faire exceptionnel.</p><br/> 
<p>L''acétate de cellulose, un plastique végétal organique et recyclable, est hypoallergénique et a été adopté pour la fabrication de lunettes depuis la fin des années 1940, en réponse aux limitations des plastiques antérieurs.</p><br/>
<p>Aujourd''hui, les acétates se distinguent par leur qualité incomparable et leur beauté époustouflante, souvent bonifiés par un vieillissement de plus de trente ans pour une robustesse accrue.</p>');
INSERT INTO public.photo_text (id, id_module, title, description, photo_path, text_content) VALUES (20, 79, 'Cours 2', NULL, 'materiaux-content-2.jpg', '<p>Nos montures en métal allient harmonieusement acier inoxydable et or 22 carats pour une
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

INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (34, 32, 'Comment définir le style Maison Nathalie Blanc ?', NULL, true);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (35, 33, 'Comment s''appelle le pont iconique de la créatrice Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (36, 33, 'Comment appelle-t-on la charnière brevetée de la collection Monsieur Blanc ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (37, 33, 'De quel côté apparaît le manchon troué ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (38, 34, 'Quel modèle porte le nom de la grand-mère de la créatrice et se distingue par sa branche inversée ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (39, 34, 'Quel modèle a été créé pour une célèbre chanteuse de jazz ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (40, 34, 'Quelle est la première monture conçue pour les hommes, marquant une extension de notre collection ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (41, 34, 'Quelle monture, inspirée par Janis Joplin, est en forme de fleur et célèbre l''esprit libre de la chanteuse ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (42, 35, 'Quels matériaux naturels sont utilisés dans les montures en acétate de Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (43, 35, 'Pourquoi l''acétate de cellulose est-il préféré pour la fabrication de lunettes depuis la fin des années 1940 ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (44, 36, 'Quels matériaux sont utilisés pour créer la base des montures métalliques de Nathalie Blanc ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (45, 36, 'Quel est le processus utilisé pour appliquer l''or 22 carats sur les montures métalliques ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (46, 36, 'Quel est le rôle du traitement galvanique dans la fabrication des montures métalliques ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (47, 35, 'D''où provient l''acétate Mazzucchelli ?', NULL, false);
INSERT INTO public.questions (id, id_quiz, question_text, explanation, is_multiple_choice) VALUES (49, 33, 'Qu''est-ce qui caractérise les nouvelles charnières mises en avant par la marque ?', NULL, false);


--
-- TOC entry 4948 (class 0 OID 19657)
-- Dependencies: 223
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.quiz (id, id_module, title) VALUES (32, 75, 'Quiz');
INSERT INTO public.quiz (id, id_module, title) VALUES (33, 76, 'Quiz');
INSERT INTO public.quiz (id, id_module, title) VALUES (34, 77, 'Quiz');
INSERT INTO public.quiz (id, id_module, title) VALUES (35, 78, 'Quiz');
INSERT INTO public.quiz (id, id_module, title) VALUES (36, 79, 'Quiz');


--
-- TOC entry 4950 (class 0 OID 19661)
-- Dependencies: 225
-- Data for Name: texts; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
--
-- TOC entry 4956 (class 0 OID 19675)
-- Dependencies: 231
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, firstname, lastname, email, password, role, created_at, shop) VALUES (1, 'wins', 'wins', 'wins@admin.fr', '$argon2id$v=19$m=65536,t=3,p=4$cw1+NlKH/IlBZMq3f6u6Hg$/le2NsXt3HvvwT7VIWUzqk7pPO6uNOiVJMSla4/24UE', 'sadmin', '2024-06-03 13:32:57', NULL);
INSERT INTO public.users (id, firstname, lastname, email, password, role, created_at, shop) VALUES (2, 'test', 'un', 'test@un.fr', '$argon2id$v=19$m=65536,t=3,p=4$UBvfbrmSTnwA2wib0VYINA$JDwuPrIfVX/1mEr+kANTiVSM8C25b7g3u6xWQ0dlnhc', 'user', '2024-06-03 13:53:06', 'Edgard Caen');
INSERT INTO public.users (id, firstname, lastname, email, password, role, created_at, shop) VALUES (3, 'test', 'deux', 'test@deux.fr', '$argon2id$v=19$m=65536,t=3,p=4$T2+8ko1CZzzba4aKZPmyCw$75JLO7K30LH4oTlznGDsTija3YhQz4Kj4H71DbROZPE', 'user', '2024-06-03 13:53:30', 'Krys Boulogne');


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

SELECT pg_catalog.setval('public.user_answers_id_seq', 97, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_progression_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progression_id_seq', 119, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 234
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_id_seq', 15, true);


--
-- TOC entry 4750 (class 2606 OID 19698)
-- Name: answers_options answers_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options
    ADD CONSTRAINT answers_options_pkey PRIMARY KEY (id);


--
-- TOC entry 4752 (class 2606 OID 19700)
-- Name: formations formations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations
    ADD CONSTRAINT formations_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 19702)
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 19857)
-- Name: photo_text photo_text_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo_text
    ADD CONSTRAINT photo_text_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 19704)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 19706)
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 19708)
-- Name: texts texts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 19710)
-- Name: user_answers user_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 4764 (class 2606 OID 19864)
-- Name: user_progression user_progression_id_photo_text_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_photo_text_id_user_key UNIQUE (id_photo_text, id_user);


--
-- TOC entry 4766 (class 2606 OID 19712)
-- Name: user_progression user_progression_id_quiz_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_quiz_id_user_key UNIQUE (id_quiz, id_user);


--
-- TOC entry 4768 (class 2606 OID 19714)
-- Name: user_progression user_progression_id_text_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_text_id_user_key UNIQUE (id_text, id_user);


--
-- TOC entry 4770 (class 2606 OID 19716)
-- Name: user_progression user_progression_id_video_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_video_id_user_key UNIQUE (id_video, id_user);


--
-- TOC entry 4772 (class 2606 OID 19718)
-- Name: user_progression user_progression_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_pkey PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 19720)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4776 (class 2606 OID 19722)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 19723)
-- Name: answers_options answers_options_id_question_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options
    ADD CONSTRAINT answers_options_id_question_foreign FOREIGN KEY (id_question) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 4780 (class 2606 OID 19728)
-- Name: modules modules_id_formation_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_id_formation_foreign FOREIGN KEY (id_formation) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- TOC entry 4796 (class 2606 OID 19858)
-- Name: photo_text photo_text_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo_text
    ADD CONSTRAINT photo_text_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4781 (class 2606 OID 19733)
-- Name: questions questions_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 19738)
-- Name: quiz quiz_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 19743)
-- Name: texts texts_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 19748)
-- Name: user_answers user_answers_id_answer_option_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_answer_option_foreign FOREIGN KEY (id_answer_option) REFERENCES public.answers_options(id) ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 19753)
-- Name: user_answers user_answers_id_question_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_question_foreign FOREIGN KEY (id_question) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 4786 (class 2606 OID 19758)
-- Name: user_answers user_answers_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 19763)
-- Name: user_answers user_answers_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4788 (class 2606 OID 19768)
-- Name: user_progression user_progression_id_formation_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_formation_foreign FOREIGN KEY (id_formation) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- TOC entry 4789 (class 2606 OID 19773)
-- Name: user_progression user_progression_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4790 (class 2606 OID 19865)
-- Name: user_progression user_progression_id_photo_text_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_photo_text_foreign FOREIGN KEY (id_photo_text) REFERENCES public.photo_text(id) ON DELETE CASCADE;


--
-- TOC entry 4791 (class 2606 OID 19778)
-- Name: user_progression user_progression_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4792 (class 2606 OID 19783)
-- Name: user_progression user_progression_id_text_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_text_foreign FOREIGN KEY (id_text) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 19788)
-- Name: user_progression user_progression_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4794 (class 2606 OID 19793)
-- Name: user_progression user_progression_id_video_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_video_foreign FOREIGN KEY (id_video) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- TOC entry 4795 (class 2606 OID 19798)
-- Name: videos videos_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


-- Completed on 2024-08-02 14:37:04

--
-- PostgreSQL database dump complete
--

