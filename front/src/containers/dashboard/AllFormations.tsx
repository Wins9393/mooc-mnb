import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { Menu, type GetProp, type MenuProps } from "antd";
import { ContentByModule, QuizByModule } from "../../types/types";

type MenuItem = GetProp<MenuProps, "items">[number];

export function AllFormations() {
  const [contentByModule, setContentByModule] = useState<ContentByModule | null>(null);
  const [quizByModule, setQuizByModule] = useState<QuizByModule | null>(null);

  const mainContext = useContext(MainContext);
  if (!mainContext) return null;
  const { formations, getContentByModule, getQuizByModule } = mainContext;

  useEffect(() => {
    console.log("CONTENT BY MODULE: ", contentByModule);
  }, [contentByModule]);

  useEffect(() => {
    console.log("FORMATIONS: ", formations);
  }, [formations]);

  const handleMenuItemClick: MenuProps["onClick"] = async (info) => {
    // info?.domEvent.stopPropagation();
    // info?.domEvent.preventDefault();
    console.log("item key: ", info?.key);
    console.log("item: ", info);
    const parts = info.key.split("-");
    const contentType = parts[parts.length - 2];
    const contentId = parts[parts.length - 1];
    console.log(contentType, contentId);

    if (contentType === "module") {
      const content = await getContentByModule(Number(contentId));
      const quiz = await getQuizByModule(Number(contentId));
      setContentByModule(content);
      setQuizByModule(quiz);
    }
  };

  const MenuItemFormation: MenuItem[] = formations.map((formation) => ({
    key: `formation-${formation.id}`,
    label: (
      <li style={{ display: "flex", flexDirection: "column", padding: "8px" }}>
        <p style={{ fontSize: "16px", lineHeight: "30px" }}>{formation.title}</p>
        <p style={{ fontSize: "12px", lineHeight: "20px" }}>{formation.description}</p>
      </li>
    ),
    children: formation.modules.map((module) => {
      return {
        key: `formation-${formation.id}-module-${module.id}`,
        label: (
          <li style={{ display: "flex", flexDirection: "column" }}>
            <span>{module.title}</span> <span>{module.description}</span>
          </li>
        ),
        children: contentByModule?.videos?.map((video) => {
          return {
            key: `formation-${formation.id}-module-${module.id}-video-${video.id_video}`,
            label: video.title_video,
            children: "",
          };
        }),
      };
    }),
  }));

  return (
    <>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="vertical"
        theme="light"
        triggerSubMenuAction="click"
        items={MenuItemFormation}
        onClick={handleMenuItemClick}
      />
    </>
  );
}
