import { MouseEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "../../../contexts/MainContext";
import { Button, Cascader, CascaderProps } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ContentByModule, ContentType, Quiz } from "../../../types/types";
import { ModalEdit } from "../../../components/dashboard-components/modal-edit/ModalEdit";
import { ModalSupp } from "../../../components/dashboard-components/modal-supp/ModalSupp";
import "./all-formations.css";
import { ModalAdd } from "../../../components/dashboard-components/modal-add/ModalAdd";

interface Option {
  value: string | number;
  label: React.ReactNode;
  children?: Option[];
}

export function AllFormations() {
  const [contentByModule, setContentByModule] = useState<ContentByModule | null>(null);
  const [quizByModule, setQuizByModule] = useState<Quiz | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openSupp, setOpenSupp] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [content, setContent] = useState<ContentType | null>(null);
  const [isModifiedContent, setIsModifiedContent] = useState<boolean>(false);

  const mainContext = useContext(MainContext);
  if (!mainContext) return null;
  const { formations, getFormationsWithModules, getContentByModule, getQuizByModule } = mainContext;

  useEffect(() => {
    getFormationsWithModules();
  }, [isModifiedContent]);

  async function handleEditClick(e: MouseEvent<HTMLElement>, content: ContentType) {
    e.stopPropagation();
    e.preventDefault();
    setOpenEdit(true);
    setContent(content);
  }

  async function handleDeleteClick(e: MouseEvent<HTMLElement>, content: ContentType) {
    e.stopPropagation();
    e.preventDefault();
    setOpenSupp(true);
    setContent(content);
  }

  async function handleAddClick(e: MouseEvent<HTMLElement>, content: ContentType) {
    e.stopPropagation();
    e.preventDefault();
    setOpenAdd(true);
    setContent(content);
  }

  const handleMenuItemClick: CascaderProps<Option>["onChange"] = async (
    value: (string | number)[]
  ) => {
    const parts = value.slice(-1)[0];
    console.log(parts);
    const lastItemParts = (parts as string).split("-");
    const contentType = lastItemParts[lastItemParts.length - 2];
    const contentId = lastItemParts[lastItemParts.length - 1];
    console.log("contentType: ", contentType, "contentId: ", contentId);

    if (contentType === "module") {
      const content = await getContentByModule(Number(contentId));
      const quiz = await getQuizByModule(Number(contentId));
      setContentByModule(content);
      setQuizByModule(quiz);
    }
  };

  const options: Option[] = formations.map((formation) => ({
    value: `formation-${formation.id}`,
    label:
      (
        <div className="allFormations__cascaderItem--main">
          {/* <img
            className="allFormations__cascaderItem--imageFormation"
            src={`${import.meta.env.VITE_API_URL}/public/${formation.cover_path}`}
          /> */}
          <div className="allFormations__cascaderItem--title_group">
            <span style={{ fontSize: "10px", fontWeight: "bold" }}>Formation: </span>
            <p style={{ fontSize: "16px" }}>{formation.title}</p>
            <div className="allFormations__cascaderItem--content">
              <p>Publiée: {formation.published ? "Oui" : "Non"}</p>
            </div>
          </div>
          <div className="allFormations__cascaderItem--buttons_group">
            <Button
              className="button allFormations__cascaderItem--button edit"
              onClick={(e) => handleEditClick(e, formation)}
              icon={<EditOutlined />}></Button>
            <Button
              className="button allFormations__cascaderItem--button delete"
              onClick={(e) => handleDeleteClick(e, formation)}
              icon={<DeleteOutlined />}></Button>
            <Button
              className="button allFormations__cascaderItem--button add"
              onClick={(e) => handleAddClick(e, formation)}>
              {" "}
              Module <PlusOutlined />
            </Button>
          </div>
        </div>
      ) || "",
    children: formation.modules.map((module) => {
      const videos = contentByModule?.id === module.id ? contentByModule.videos : [];
      const texts = contentByModule?.id === module.id ? contentByModule.texts : [];
      const photosTexts = contentByModule?.id === module.id ? contentByModule.photos_texts : [];

      return {
        value: `formation-${formation.id}-module-${module.id}`,
        label:
          (
            <div className="allFormations__cascaderItem--main">
              <div className="allFormations__cascaderItem--title_group">
                <span style={{ fontSize: "10px", fontWeight: "bold" }}>Module: </span>
                <p style={{ fontSize: "16px" }}>{module.title}</p>
              </div>
              <div className="allFormations__cascaderItem--buttons_group">
                <Button
                  className="button allFormations__cascaderItem--button edit"
                  onClick={(e) => handleEditClick(e, module)}
                  icon={<EditOutlined />}></Button>
                <Button
                  className="button allFormations__cascaderItem--button delete"
                  onClick={(e) => handleDeleteClick(e, module)}
                  icon={<DeleteOutlined />}></Button>
                <Button
                  className="button allFormations__cascaderItem--button add"
                  onClick={(e) => handleAddClick(e, module)}>
                  Contenu <PlusOutlined />
                </Button>
              </div>
            </div>
          ) || "",
        children: [
          ...videos?.map((video) => {
            return {
              value: `formation-${formation.id}-module-${module.id}-video-${video.id_video}`,
              label:
                (
                  <div className="allFormations__cascaderItem--main">
                    <div className="allFormations__cascaderItem--title_group">
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>Vidéo: </span>
                      <p style={{ fontSize: "16px" }}>{video.title_video}</p>
                    </div>
                    <div className="allFormations__cascaderItem--content">
                      <video
                        className="allFormations__cascaderItem--imageVideo"
                        src={`${import.meta.env.VITE_API_URL}/public/${video.path_video}`}
                      />
                    </div>
                    <div className="allFormations__cascaderItem--buttons_group">
                      <Button
                        className="button allFormations__cascaderItem--button edit"
                        onClick={(e) => handleEditClick(e, video)}
                        icon={<EditOutlined />}></Button>
                      <Button
                        className="button allFormations__cascaderItem--button delete"
                        onClick={(e) => handleDeleteClick(e, video)}
                        icon={<DeleteOutlined />}></Button>
                    </div>
                  </div>
                ) || "",
            };
          }),
          ...texts?.map((text) => {
            return {
              value: `formation-${formation.id}-module-${module.id}-text-${text.id_text}`,
              label:
                (
                  <div className="allFormations__cascaderItem--main">
                    <div className="allFormations__cascaderItem--title_group">
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>Texte: </span>
                      <p style={{ fontSize: "16px" }}>{text.title_text}</p>
                    </div>
                    <div className="allFormations__cascaderItem--content">
                      <p>{text.content_text}</p>
                    </div>
                    <div className="allFormations__cascaderItem--buttons_group">
                      <Button
                        className="button allFormations__cascaderItem--button edit"
                        onClick={(e) => handleEditClick(e, text)}
                        icon={<EditOutlined />}></Button>
                      <Button
                        className="button allFormations__cascaderItem--button delete"
                        onClick={(e) => handleDeleteClick(e, text)}
                        icon={<DeleteOutlined />}></Button>
                    </div>
                  </div>
                ) || "",
            };
          }),
          ...photosTexts?.map((pt) => {
            return {
              value: `formation-${formation.id}-module-${module.id}-photo-text-${pt.id_photo_text}`,
              label:
                (
                  <div className="allFormations__cascaderItem--main">
                    <div className="allFormations__cascaderItem--title_group">
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>Photo + Texte: </span>
                      <p style={{ fontSize: "16px" }}>{pt.title_photo_text}</p>
                    </div>
                    <div className="allFormations__cascaderItem--content">
                      <img
                        className="allFormations__cascaderItem--imagePhotoTexte"
                        src={`${import.meta.env.VITE_API_URL}/public/${pt.photo_path_photo_text}`}
                      />
                      <p>{pt.text_content_photo_text}</p>
                    </div>
                    <div className="allFormations__cascaderItem--buttons_group">
                      <Button
                        className="button allFormations__cascaderItem--button edit"
                        onClick={(e) => handleEditClick(e, pt)}
                        icon={<EditOutlined />}></Button>
                      <Button
                        className="button allFormations__cascaderItem--button delete"
                        onClick={(e) => handleDeleteClick(e, pt)}
                        icon={<DeleteOutlined />}></Button>
                    </div>
                  </div>
                ) || "",
            };
          }),
          {
            value: `formation-${formation.id}-module-${module.id}-quiz-${quizByModule?.id}`,
            label: quizByModule ? (
              <div className="allFormations__cascaderItem--main">
                <div className="allFormations__cascaderItem--title_group">
                  <span style={{ fontSize: "10px", fontWeight: "bold" }}>Quiz: </span>
                  <p style={{ fontSize: "16px" }}>{quizByModule?.title}</p>
                </div>
                <div className="allFormations__cascaderItem--buttons_group">
                  <Button
                    className="button allFormations__cascaderItem--button edit"
                    onClick={(e) => (quizByModule ? handleEditClick(e, quizByModule) : "")}
                    icon={<EditOutlined />}></Button>
                  <Button
                    className="button allFormations__cascaderItem--button delete"
                    onClick={(e) => (quizByModule ? handleDeleteClick(e, quizByModule) : "")}
                    icon={<DeleteOutlined />}></Button>
                  <Button
                    className="button allFormations__cascaderItem--button add"
                    onClick={(e) => (quizByModule ? handleAddClick(e, quizByModule) : "")}>
                    Question <PlusOutlined />
                  </Button>
                </div>
              </div>
            ) : (
              ""
            ),
            children: quizByModule?.questions.map((question) => ({
              value: `formation-${formation.id}-module-${module.id}-quiz-${quizByModule?.id}-question-${question.id}`,
              label:
                (
                  <div className="allFormations__cascaderItem--main">
                    <div className="allFormations__cascaderItem--title_group">
                      <span style={{ fontSize: "10px", fontWeight: "bold" }}>Question: </span>
                      <p style={{ fontSize: "16px" }}>{question?.question_text}</p>
                    </div>
                    <div className="allFormations__cascaderItem--content">
                      <p>
                        Choix multiple: <span>{question?.is_multiple_choice ? "Oui" : "Non"}</span>
                      </p>
                    </div>
                    <div className="allFormations__cascaderItem--buttons_group">
                      <Button
                        className="button allFormations__cascaderItem--button edit"
                        onClick={(e) => handleEditClick(e, question)}
                        icon={<EditOutlined />}></Button>
                      <Button
                        className="button allFormations__cascaderItem--button delete"
                        onClick={(e) => handleDeleteClick(e, question)}
                        icon={<DeleteOutlined />}></Button>
                      <Button
                        className="button allFormations__cascaderItem--button add"
                        onClick={(e) => handleAddClick(e, question)}>
                        Réponse <PlusOutlined />
                      </Button>
                    </div>
                  </div>
                ) || "",
              children: question.answer_options.map((ao) => ({
                value: `formation-${formation.id}-module-${module.id}-quiz-${quizByModule?.id}-question-${question.id}-answeroption-${ao.id}`,
                label:
                  (
                    <div className="allFormations__cascaderItem--main">
                      <div className="allFormations__cascaderItem--title_group">
                        <span style={{ fontSize: "10px", fontWeight: "bold" }}>Réponse: </span>
                      </div>
                      <div className="allFormations__cascaderItem--content">
                        <p style={{ fontSize: "16px" }}>{ao?.text}</p>
                      </div>
                      <div className="allFormations__cascaderItem--buttons_group">
                        <Button
                          className="button allFormations__cascaderItem--button edit"
                          onClick={(e) => handleEditClick(e, ao)}
                          icon={<EditOutlined />}></Button>
                        <Button
                          className="button allFormations__cascaderItem--button delete"
                          onClick={(e) => handleDeleteClick(e, ao)}
                          icon={<DeleteOutlined />}></Button>
                      </div>
                    </div>
                  ) || "",
              })),
            })),
          },
        ],
      };
    }),
  }));

  return (
    <>
      <ModalEdit
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        content={content}
        setIsModifiedContent={setIsModifiedContent}
        getContentByModule={getContentByModule}
      />
      <ModalSupp
        openSupp={openSupp}
        setOpenSupp={setOpenSupp}
        content={content}
        setIsModifiedContent={setIsModifiedContent}
        getContentByModule={getContentByModule}
        setContentByModule={setContentByModule}
        getQuizByModule={getQuizByModule}
        setQuizByModule={setQuizByModule}
      />
      <ModalAdd
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        content={content}
        setIsModifiedContent={setIsModifiedContent}
        getContentByModule={getContentByModule}
        setContentByModule={setContentByModule}
        getQuizByModule={getQuizByModule}
        setQuizByModule={setQuizByModule}
      />
      <Cascader.Panel
        className="allFormations__cascader"
        options={options}
        onChange={handleMenuItemClick}
        changeOnSelect={true}
      />
    </>
  );
}
