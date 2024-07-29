import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContentType, QuestionFromDB, Quiz } from "../../../types/types";
import { Form, Input, Switch } from "antd";

interface AddQuestionModalInterface {
  currentModuleId: number | null;
  content: ContentType | null;
  getQuizByModule: (id_module: number) => Promise<Quiz | null>;
  setQuizByModule: Dispatch<SetStateAction<Quiz | null>>;
  setCustomHandleOk: Dispatch<SetStateAction<() => Promise<void>>>;
}

export function AddQuestionDisplay({
  currentModuleId,
  content,
  getQuizByModule,
  setQuizByModule,
  setCustomHandleOk,
}: AddQuestionModalInterface) {
  const [newQuestion, setNewQuestion] = useState<QuestionFromDB | null>(null);

  useEffect(() => {
    setNewQuestion({
      id: 0,
      id_quiz: (content as Quiz).id,
      question_text: "",
      is_multiple_choice: false,
    });
  }, [content]);

  useEffect(() => {
    console.log("newQuestion", newQuestion);
  }, [newQuestion]);

  useEffect(() => {
    console.log("currentModuleId", currentModuleId);
  }, [currentModuleId]);

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newQuestion, content]);

  function onQuestionTextChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setNewQuestion(
      (prevQuestion) => ({ ...prevQuestion, question_text: e.target.value } as QuestionFromDB)
    );
  }

  function onMultipleChoiceChange(checked: boolean) {
    console.log(checked);
    setNewQuestion(
      (prevQuestion) => ({ ...prevQuestion, is_multiple_choice: checked } as QuestionFromDB)
    );
  }

  async function customHandleOk() {
    console.log(newQuestion);
    if (newQuestion?.question_text !== "" && newQuestion?.id_quiz) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/question/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok && currentModuleId) {
        setQuizByModule(await getQuizByModule(currentModuleId));
      }
    }
  }

  return (
    <Form>
      <Form.Item
        label="Titre de la question"
        name={["title"]}
        rules={[{ required: true, message: "Le titre du module est requis" }]}>
        <Input value={newQuestion?.question_text} onChange={onQuestionTextChange} />
      </Form.Item>
      <Form.Item label="Choix Multiple ?" name={["description"]}>
        <Switch
          defaultChecked={newQuestion?.is_multiple_choice}
          onChange={onMultipleChoiceChange}
        />
      </Form.Item>
    </Form>
  );
}
