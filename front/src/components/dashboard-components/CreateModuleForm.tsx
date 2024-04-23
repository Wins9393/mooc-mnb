import { Form, Input, Button, Space, FormListFieldData, Card } from "antd";
import { ModuleToDB } from "../../types/types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

interface ModuleFormProps {
  newModules: ModuleToDB[];
  setNewModules: React.Dispatch<React.SetStateAction<ModuleToDB[]>>;
}

export function CreateModuleForm({ newModules, setNewModules }: ModuleFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ modules: newModules });
  }, [newModules, form]);

  const onModuleChange = (index: number, field: "title" | "description", value: string) => {
    // Copie et mise à jour de l'objet module spécifique
    const updatedModules = [...newModules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value,
      type: "module",
      id_formation: null,
    };

    setNewModules(updatedModules);
  };

  function onRemoveModule(field: FormListFieldData) {
    const updatedModules = [...newModules];
    const filteredModules = updatedModules.filter((newModule, index) => index !== field.key);
    setNewModules(filteredModules);
  }

  return (
    <>
      <h2 className="dashboardPage__main-content--h2">
        Créez, ici, tous les modules de la formation
      </h2>
      <Form name="dynamic_module_form" form={form} layout="vertical" style={{ width: "100%" }}>
        <Form.List name="modules">
          {(fields, { add, remove }) => (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {fields.map((field, index) => {
                  return (
                    <Card
                      title={`module ${index + 1}`}
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1 1 30%",
                        marginBottom: 8,
                      }}
                      extra={<MinusCircleOutlined onClick={() => onRemoveModule(field)} />}>
                      <Form.Item
                        label="Titre du module"
                        name={[field.name, "title"]}
                        rules={[{ required: true, message: "Le titre du module est requis" }]}>
                        <Input
                          value={newModules[index]?.title}
                          onChange={(e) => onModuleChange(index, "title", e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Description du module" name={[field.name, "description"]}>
                        <Input.TextArea
                          value={newModules[index]?.description}
                          onChange={(e) => onModuleChange(index, "description", e.target.value)}
                        />
                      </Form.Item>
                    </Card>
                  );
                })}
              </div>
              <Button type="dashed" onClick={() => add()} block>
                + Ajouter un module
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
}
