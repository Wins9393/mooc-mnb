--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-05-14 12:07:37

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
-- TOC entry 224 (class 1259 OID 18691)
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
-- TOC entry 223 (class 1259 OID 18690)
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
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 223
-- Name: answers_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answers_options_id_seq OWNED BY public.answers_options.id;


--
-- TOC entry 216 (class 1259 OID 18655)
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
-- TOC entry 215 (class 1259 OID 18654)
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
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 215
-- Name: formations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formations_id_seq OWNED BY public.formations.id;


--
-- TOC entry 220 (class 1259 OID 18673)
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
-- TOC entry 219 (class 1259 OID 18672)
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
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 219
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- TOC entry 226 (class 1259 OID 18700)
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
-- TOC entry 225 (class 1259 OID 18699)
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
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 225
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 232 (class 1259 OID 18725)
-- Name: quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz (
    id integer NOT NULL,
    id_module integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE public.quiz OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18724)
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
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 231
-- Name: quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_id_seq OWNED BY public.quiz.id;


--
-- TOC entry 230 (class 1259 OID 18716)
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
-- TOC entry 229 (class 1259 OID 18715)
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
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 229
-- Name: texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.texts_id_seq OWNED BY public.texts.id;


--
-- TOC entry 228 (class 1259 OID 18709)
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
-- TOC entry 227 (class 1259 OID 18708)
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
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_answers_id_seq OWNED BY public.user_answers.id;


--
-- TOC entry 234 (class 1259 OID 18814)
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
    complete boolean NOT NULL
);


ALTER TABLE public.user_progression OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18813)
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
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 233
-- Name: user_progression_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progression_id_seq OWNED BY public.user_progression.id;


--
-- TOC entry 218 (class 1259 OID 18664)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    shop character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18663)
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
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 222 (class 1259 OID 18682)
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
-- TOC entry 221 (class 1259 OID 18681)
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
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 221
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 4737 (class 2604 OID 18866)
-- Name: answers_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options ALTER COLUMN id SET DEFAULT nextval('public.answers_options_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 18867)
-- Name: formations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations ALTER COLUMN id SET DEFAULT nextval('public.formations_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 18868)
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 18869)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 18870)
-- Name: quiz id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz ALTER COLUMN id SET DEFAULT nextval('public.quiz_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 18871)
-- Name: texts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts ALTER COLUMN id SET DEFAULT nextval('public.texts_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 18872)
-- Name: user_answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers ALTER COLUMN id SET DEFAULT nextval('public.user_answers_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 18873)
-- Name: user_progression id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression ALTER COLUMN id SET DEFAULT nextval('public.user_progression_id_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 18874)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 18875)
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- TOC entry 4752 (class 2606 OID 18698)
-- Name: answers_options answers_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options
    ADD CONSTRAINT answers_options_pkey PRIMARY KEY (id);


--
-- TOC entry 4744 (class 2606 OID 18662)
-- Name: formations formations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations
    ADD CONSTRAINT formations_pkey PRIMARY KEY (id);


--
-- TOC entry 4748 (class 2606 OID 18680)
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 18707)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 18730)
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 18723)
-- Name: texts texts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 18714)
-- Name: user_answers user_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 18862)
-- Name: user_progression user_progression_id_quiz_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_quiz_id_user_key UNIQUE (id_quiz, id_user);


--
-- TOC entry 4764 (class 2606 OID 18864)
-- Name: user_progression user_progression_id_text_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_text_id_user_key UNIQUE (id_text, id_user);


--
-- TOC entry 4766 (class 2606 OID 18859)
-- Name: user_progression user_progression_id_video_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_video_id_user_key UNIQUE (id_video, id_user);


--
-- TOC entry 4768 (class 2606 OID 18819)
-- Name: user_progression user_progression_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_pkey PRIMARY KEY (id);


--
-- TOC entry 4746 (class 2606 OID 18671)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4750 (class 2606 OID 18689)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 18736)
-- Name: answers_options answers_options_id_question_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers_options
    ADD CONSTRAINT answers_options_id_question_foreign FOREIGN KEY (id_question) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 4769 (class 2606 OID 18776)
-- Name: modules modules_id_formation_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_id_formation_foreign FOREIGN KEY (id_formation) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- TOC entry 4772 (class 2606 OID 18771)
-- Name: questions questions_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4778 (class 2606 OID 18761)
-- Name: quiz quiz_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4777 (class 2606 OID 18766)
-- Name: texts texts_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4773 (class 2606 OID 18731)
-- Name: user_answers user_answers_id_answer_option_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_answer_option_foreign FOREIGN KEY (id_answer_option) REFERENCES public.answers_options(id) ON DELETE CASCADE;


--
-- TOC entry 4774 (class 2606 OID 18741)
-- Name: user_answers user_answers_id_question_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_question_foreign FOREIGN KEY (id_question) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 4775 (class 2606 OID 18751)
-- Name: user_answers user_answers_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4776 (class 2606 OID 18746)
-- Name: user_answers user_answers_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4779 (class 2606 OID 18835)
-- Name: user_progression user_progression_id_formation_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_formation_foreign FOREIGN KEY (id_formation) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- TOC entry 4780 (class 2606 OID 18830)
-- Name: user_progression user_progression_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- TOC entry 4781 (class 2606 OID 18825)
-- Name: user_progression user_progression_id_quiz_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_quiz_foreign FOREIGN KEY (id_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 18840)
-- Name: user_progression user_progression_id_text_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_text_foreign FOREIGN KEY (id_text) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 18820)
-- Name: user_progression user_progression_id_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 18845)
-- Name: user_progression user_progression_id_video_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progression
    ADD CONSTRAINT user_progression_id_video_foreign FOREIGN KEY (id_video) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- TOC entry 4770 (class 2606 OID 18756)
-- Name: videos videos_id_module_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_id_module_foreign FOREIGN KEY (id_module) REFERENCES public.modules(id) ON DELETE CASCADE;


-- Completed on 2024-05-14 12:07:37

--
-- PostgreSQL database dump complete
--

