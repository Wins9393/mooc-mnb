import { Form, Input, Switch } from "antd";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnswerOptionToDB, ContentType, QuestionFromDB, Quiz } from "../../../types/types";

interface AddAnswerOptionModalInterface {
  currentModuleId: number | null;
  content: ContentType | null;
  getQuizByModule: (id_module: number) => Promise<Quiz | null>;
  setQuizByModule: Dispatch<SetStateAction<Quiz | null>>;
  setCustomHandleOk: Dispatch<SetStateAction<() => Promise<void>>>;
}

export function AddAnswerOptionDisplay({
  currentModuleId,
  content,
  getQuizByModule,
  setQuizByModule,
  setCustomHandleOk,
}: AddAnswerOptionModalInterface) {
  const [newAnswerOption, setNewAnswerOption] = useState<AnswerOptionToDB | null>(null);

  useEffect(() => {
    setNewAnswerOption({
      type: "answeroption",
      key: null,
      id_question: (content as QuestionFromDB).id,
      answer_text: "",
      correct: false,
    });
  }, [content]);

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newAnswerOption, content]);

  function onAnswerOptionTextChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setNewAnswerOption(
      (prevAO) => ({ ...prevAO, answer_text: e.target.value } as AnswerOptionToDB)
    );
  }

  function onCorrectChange(checked: boolean) {
    console.log(checked);
    setNewAnswerOption((prevAO) => ({ ...prevAO, correct: checked } as AnswerOptionToDB));
  }

  async function customHandleOk() {
    if (newAnswerOption?.answer_text !== "" && newAnswerOption?.id_question) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/answer_option/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnswerOption),
      });

      if (response.ok && currentModuleId) {
        setQuizByModule(await getQuizByModule(currentModuleId));
      }
    }
  }

  return (
    <Form>
      <Form.Item
        label="Contenu de la réponse"
        name={["answer_text"]}
        rules={[{ required: true, message: "Le contenu de la réponse est requis" }]}>
        <Input value={newAnswerOption?.answer_text} onChange={onAnswerOptionTextChange} />
      </Form.Item>
      <Form.Item label="Bonne réponse ?" name={["correct"]}>
        <Switch defaultChecked={newAnswerOption?.correct} onChange={onCorrectChange} />
      </Form.Item>
    </Form>
  );
}
