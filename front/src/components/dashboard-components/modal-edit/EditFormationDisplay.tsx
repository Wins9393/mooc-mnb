import { Button, Form, Input, message, Switch, Upload, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { returnFileSizeFormated } from "../../../utils/utils";
import { Formation } from "../../../types/types";
import { MainContext } from "../../../contexts/MainContext";

const { TextArea } = Input;

interface EditFormationModalInterface {
  content: Formation | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  setCustomHandleOk: Dispatch<SetStateAction<() => Promise<void>>>;
}

export function EditFormationDisplay({
  content,
  setIsModifiedContent,
  setCustomHandleOk,
}: EditFormationModalInterface) {
  const [newFormation, setNewFormation] = useState<Formation | null>(null);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);

  const maxSize = 500000;

  const mainContext = useContext(MainContext);
  if (!mainContext) return null;

  const { updateFormation } = mainContext;

  useEffect(() => {
    if (content !== null) {
      setNewFormation(content as Formation);
    }
  }, [content]);

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newFormation, selectedFile]);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isJPG = file.type === "image/jpeg";

      if (!isJPG) {
        message.error(`${file.name} n'est pas un fichier .jpg`);
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxSize) {
        message.error(
          `La taille maximum d'une photos ne peut excéder ${returnFileSizeFormated(maxSize)}. ${
            file.name
          } pèse ${returnFileSizeFormated(file.size)} `
        );
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: (info) => {
      if (info.file.status === "removed") {
        setSelectedFile(null);
      } else {
        setSelectedFile(info.file);
        setNewFormation((prev) => (prev ? { ...prev, cover_path: info.file.name } : null));
      }
    },
    maxCount: 1,
    listType: "picture-card",
  };

  function handleOnTitleFormationChange(e: ChangeEvent<HTMLInputElement>) {
    setNewFormation((prev) => (prev ? { ...prev, title: e.target.value } : null));
  }

  function handleOnDescriptionFormationChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNewFormation((prev) => (prev ? { ...prev, description: e.target.value } : null));
  }

  function handleOnPublishedFormationChange(checked: boolean) {
    setNewFormation((prev) => (prev ? { ...prev, published: checked } : null));
  }

  async function customHandleOk() {
    if (JSON.stringify(content) !== JSON.stringify(newFormation)) {
      try {
        await updateFormation(newFormation);
      } catch (error) {
        message.error("Une erreur est survenue lors de la modification de la formation");
        console.log(error);
      }

      if (selectedFile !== null && selectedFile instanceof File) {
        try {
          const formData = new FormData();
          formData.append("selectedFile", selectedFile, selectedFile.name);

          await fetch(`${import.meta.env.VITE_API_URL}/upload/file`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
        } catch (error) {
          message.error(
            "Une erreur est survenue lors de la modification de l'image de la formation"
          );
          console.log(error);
        }
      }
      message.success("Formation modifiée");
      setIsModifiedContent(true);
    }
  }

  return (
    <div className="modal__body--formation">
      <Form>
        <Form.Item>
          <Upload
            {...uploadProps}
            defaultFileList={[
              {
                uid: String((content as Formation).id),
                name: (content as Formation).title,
                status: "done",
                url: `${import.meta.env.VITE_API_URL}/public/${(content as Formation).cover_path}`,
              },
            ]}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <label>Titre</label>
          <Input
            defaultValue={(content as Formation).title}
            onChange={(e) => handleOnTitleFormationChange(e)}></Input>
        </Form.Item>
        <Form.Item>
          <label>Description</label>
          <TextArea
            defaultValue={(content as Formation).description}
            onChange={(e) => handleOnDescriptionFormationChange(e)}></TextArea>
        </Form.Item>
        <Form.Item>
          <Switch
            defaultChecked={(content as Formation).published}
            onChange={(e) => handleOnPublishedFormationChange(e)}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
