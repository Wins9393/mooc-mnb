import { Form, Input, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContentType, Formation, ModuleToDB } from "../../../types/types";

interface AddFormationModalInterface {
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  setCustomHandleOk: Dispatch<SetStateAction<() => Promise<void>>>;
}

export function AddFormationDisplay({
  content,
  setIsModifiedContent,
  setCustomHandleOk,
}: AddFormationModalInterface) {
  const [newModule, setNewModule] = useState<ModuleToDB | null>(null);

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newModule, content]);

  useEffect(() => {
    if ((content as Formation)?.id !== newModule?.id_formation) {
      setNewModule(null);
    }
  }, [newModule, content]);

  function onModuleChange(field: "title" | "description", value: string) {
    setNewModule((prevModule) => {
      console.log("content: ", content, "prevModule: ", prevModule);
      const updatedModule = {
        ...prevModule,
        [field]: value,
        type: "module",
        id_formation: (content as Formation).id,
      } as ModuleToDB;

      return updatedModule;
    });
  }

  async function customHandleOk() {
    if (newModule?.title !== null && newModule?.id_formation) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/module/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newModule),
      });

      if (response.ok) {
        setIsModifiedContent(true);
      }
    } else {
      message.error("Une erreur empêche la création du module");
    }
  }

  return (
    <Form>
      <Form.Item
        label="Titre du module"
        name={["title"]}
        rules={[{ required: true, message: "Le titre du module est requis" }]}>
        <Input value={newModule?.title} onChange={(e) => onModuleChange("title", e.target.value)} />
      </Form.Item>
      <Form.Item label="Description du module" name={["description"]}>
        <Input.TextArea
          value={newModule?.description}
          onChange={(e) => onModuleChange("description", e.target.value)}
        />
      </Form.Item>
    </Form>
  );
}
