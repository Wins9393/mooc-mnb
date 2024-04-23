import { Card, Form, Input, Upload, UploadFile, UploadProps, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FormationToDB } from "../../types/types";

const { TextArea } = Input;

interface FormationFormProps {
  newFormation: FormationToDB;
  setNewFormation: React.Dispatch<React.SetStateAction<FormationToDB>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<UploadFile | null>>;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function CreateFormationForm({
  newFormation,
  setNewFormation,
  setSelectedFile,
}: FormationFormProps) {
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        message.error(`${file.name} n'est pas un fichier .jpg`);
      }
      return false;
    },
    onChange: (info) => {
      console.log(info);
      if (info.file.status === "removed") {
        setSelectedFile(null);
      } else {
        setSelectedFile(info.file);
        setNewFormation((prevFormation: FormationToDB) => ({
          ...prevFormation,
          cover_path: info.file.name,
        }));
      }
    },
    maxCount: 1,
    listType: "picture-card",
  };

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const title = event.target.value;
    setNewFormation((prevFormation: FormationToDB) => ({ ...prevFormation, title }));
  }

  function handleDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const description = event.target.value;
    setNewFormation((prevFormation: FormationToDB) => ({
      ...prevFormation,
      description: description || undefined,
    }));
  }

  return (
    <>
      <h2 className="dashboardPage__main-content--h2">Commencez par créer une formation</h2>
      <Form layout="vertical" className="dashboardPage__formation-form">
        <Card>
          <Form.Item required label="Titre de la formation">
            <Input onChange={handleTitleChange} value={newFormation?.title} />
          </Form.Item>
          <Form.Item label="Description de la formation">
            <TextArea onChange={handleDescriptionChange} value={newFormation?.description} />
          </Form.Item>
          <Form.Item
            required
            label="Image de la formation (.jpg requis)"
            valuePropName="fileList"
            getValueFromEvent={normFile}>
            <Upload {...uploadProps}>
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
        </Card>
      </Form>
    </>
  );
}
