import { Collapse, CollapseProps } from "antd";
import {
  Module,
  ModuleCollapseItem,
  PhotoText,
  Quiz,
  Text,
  UserProgression,
  Video,
} from "../../types/types";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { MainContext } from "../../contexts/MainContext";
import { AuthContext } from "../../contexts/AuthContext";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  FileImageOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface CollapseModuleInterface {
  modules: Module[] | null;
  currentModule: Module | null;
  setCurrentModule: Dispatch<SetStateAction<Module | null>>;
  currentModuleItem: ModuleCollapseItem | null;
  setCurrentModuleItem: Dispatch<SetStateAction<ModuleCollapseItem | null>>;
  setFadeClass: Dispatch<SetStateAction<string>>;
  setSelectedItemId: Dispatch<SetStateAction<string | null>>;
  selectedItemId: string | null;
  setIsVideoEnded: Dispatch<SetStateAction<boolean>>;
  isProgressionSavedByType(
    userProgression: UserProgression[] | null,
    id_content: number,
    type: string
  ): boolean;
  getOldUserAnswers(id_user: number, id_quiz: number): Promise<void>;
}

export function CollapseModule({
  modules,
  currentModule,
  setCurrentModule,
  currentModuleItem,
  setCurrentModuleItem,
  setFadeClass,
  setSelectedItemId,
  selectedItemId,
  setIsVideoEnded,
  isProgressionSavedByType,
  getOldUserAnswers,
}: CollapseModuleInterface) {
  const authContext = useContext(AuthContext);
  if (!authContext) return;

  const mainContext = useContext(MainContext);
  if (!mainContext) return;

  const { user } = authContext ?? {};

  const {
    getContentByModule,
    moduleContent,
    getQuizByModule,
    moduleQuiz,
    userProgression,
    saveUserProgression,
  } = mainContext ?? {};

  useEffect(() => {
    console.log("moduleContent: ", moduleContent);
  }, [moduleContent]);

  useEffect(() => {
    console.log("userProgression: ", userProgression);
  }, [userProgression]);

  function changeCollapseBGColor(userProgression: UserProgression[], content: ModuleCollapseItem) {
    const result = userProgression?.some((progress) => {
      if (content.type === "video") {
        return (content?.item as Video).id_video === progress.id_video;
      }
      if (content.type === "text") {
        return (content?.item as Text).id_text === progress.id_text;
      }
      if (content.type === "photo_text") {
        return (content?.item as PhotoText).id_photo_text === progress.id_photo_text;
      }
      if (content.type === "quiz") {
        return (content?.item as Quiz).id === progress.id_quiz;
      }
    });

    if (result) {
      return { backgroundColor: "var(--nude)" };
    }
    return {};
  }

  function onItemModuleClick(moduleItem: ModuleCollapseItem) {
    if (moduleItem.id !== currentModuleItem?.id) {
      setFadeClass("content--fade-out");
      setSelectedItemId(moduleItem.id);
      setIsVideoEnded(false);

      if (
        user &&
        currentModule &&
        moduleItem.type === "text" &&
        !isProgressionSavedByType(userProgression, (moduleItem.item as Text).id_text, "text")
      ) {
        saveUserProgression({
          id_user: user?.id,
          id_formation: currentModule?.id_formation,
          id_module: currentModule.id,
          id_text: (moduleItem.item as Text).id_text,
          complete: true,
        });
      }

      if (
        user &&
        currentModule &&
        moduleItem.type === "photo_text" &&
        !isProgressionSavedByType(
          userProgression,
          (moduleItem.item as PhotoText).id_photo_text,
          "photo_text"
        )
      ) {
        saveUserProgression({
          id_user: user?.id,
          id_formation: currentModule?.id_formation,
          id_module: currentModule.id,
          id_photo_text: (moduleItem.item as PhotoText).id_photo_text,
          complete: true,
        });
      }

      setTimeout(() => {
        setCurrentModuleItem(moduleItem);
        setFadeClass("content--fade-in");
      }, 400);
    }

    if (moduleItem && moduleItem.type === "quiz" && user) {
      getOldUserAnswers(user.id, (moduleItem.item as Quiz).id);
    }
    window.scrollTo(0, 0);
  }

  // Boucle sur les modules présents dans la formation pour remplir le tableau d'Items pour le Collapse
  function getCollapseItems(modules: Module[]) {
    console.log("modules:", modules);
    let items: CollapseProps["items"] = [];

    if (!modules) {
      return;
    }

    modules.forEach((module) => {
      const combinedContent = [
        ...(moduleContent?.videos?.map((video) => ({
          type: "video",
          id: `video-${video.id_video}`,
          title: video.title_video,
          item: video,
        })) || []),
        ...(moduleContent?.texts?.map((text) => ({
          type: "text",
          id: `text-${text.id_text}`,
          title: text.title_text,
          item: text,
        })) || []),
        ...(moduleContent?.photos_texts?.map((pt) => ({
          type: "photo_text",
          id: `photo_text-${pt.id_photo_text}`,
          title: pt.title_photo_text,
          item: pt,
        })) || []),
        moduleQuiz
          ? { type: "quiz", id: `quiz-${moduleQuiz.id}`, title: moduleQuiz.title, item: moduleQuiz }
          : { type: "quiz", id: "", title: "", item: null },
      ];

      const contentItems = combinedContent.map((content) => (
        <div
          className="formationPage__collapse-item-box"
          style={
            userProgression && content.item ? changeCollapseBGColor(userProgression, content) : {}
          }
          key={content.id}
          onClick={() => onItemModuleClick(content)}>
          <span className={content.id === selectedItemId ? "selected-item" : ""}></span>
          <p className="formationPage__collapse-item">{content.title}</p>
          {content.type === "video" && <PlayCircleOutlined />}
          {content.type === "text" && <FileTextOutlined />}
          {content.type === "photo_text" && <FileImageOutlined />}
          {content.type === "quiz" && <QuestionCircleOutlined />}
        </div>
      ));

      items?.push({
        key: module.id,
        label: module.title,
        children: contentItems,
        onClick: () => {
          if (currentModule?.id !== module.id) {
            setCurrentModule(module);
            getContentByModule(module.id);
            getQuizByModule(module.id);
          }
        },
      });
    });

    return items;
  }
  return (
    <>
      <div className="formationPage__title">
        <h2 className="title-h2">Les modules</h2>
      </div>
      <Collapse
        className="formationPage__accordion"
        accordion
        size="large"
        items={modules ? getCollapseItems(modules) : []}></Collapse>
    </>
  );
}
