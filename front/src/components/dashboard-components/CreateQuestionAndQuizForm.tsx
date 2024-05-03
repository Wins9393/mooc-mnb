import { Button, Card, Divider, Form, Input, Radio } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { ModuleToDB, QuizQuestionsAndAnswersContent } from "../../types/types";
import { useEffect } from "react";

interface QuestionFormProps {
  newModules: ModuleToDB[];
  quizQuestionsAndAnswers: QuizQuestionsAndAnswersContent;
  setQuizQuestionsAndAnswers: React.Dispatch<React.SetStateAction<QuizQuestionsAndAnswersContent>>;
}

export function CreateQuestionAndQuizForm({
  newModules,
  quizQuestionsAndAnswers,
  setQuizQuestionsAndAnswers,
}: QuestionFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(quizQuestionsAndAnswers);
  }, [form]);

  const initialValues = newModules.reduce((acc: QuizQuestionsAndAnswersContent, module, index) => {
    acc[`module-${index}`] = [
      {
        type: "quiz",
        quiz_title: "",
        questions: [],
      },
    ];
    return acc;
  }, {});

  async function handleValuesChange(allValues: QuizQuestionsAndAnswersContent): Promise<void> {
    console.log("allValuesQuiz: ", allValues);
    setQuizQuestionsAndAnswers(allValues);
  }

  return (
    <>
      <h2 className="dashboardPage__main-content--h2">
        Créez un Quiz et ajoutez autant de Questions que vous le souhaitez
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
        {newModules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            style={{ display: "flex", flexDirection: "column", flex: "1 1 30%" }}>
            <h3 style={{ fontSize: "1.4rem" }}>{module.title}</h3>
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={form}
              name={`form-module-${moduleIndex}`}
              // style={{ maxWidth: 600, minWidth: 300 }}
              autoComplete="off"
              layout="vertical"
              initialValues={initialValues}
              onValuesChange={(newValues, allValues) => handleValuesChange(allValues)}>
              <Form.List name={`module-${moduleIndex}`} initialValue={[]}>
                {(fields) => (
                  <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
                    {fields.map((field) => (
                      <Card size="small" title={`Quiz ${field.name + 1}`} key={field.key}>
                        <Form.Item
                          {...field}
                          label="Titre du Quiz"
                          name={[field.name, "quiz_title"]}
                          rules={[{ required: true, message: "Le titre du quiz est requis" }]}>
                          <Input />
                        </Form.Item>

                        <Form.Item label="Questions">
                          <Form.List name={[field.name, "questions"]}>
                            {(questionFields, questionsOpt) => (
                              <div>
                                {questionFields.map((questionField) => (
                                  <Card
                                    key={questionField.key}
                                    title={`Question ${questionField.name + 1}`}
                                    extra={
                                      <CloseOutlined
                                        onClick={() => {
                                          questionsOpt.remove(questionField.name);
                                        }}
                                      />
                                    }
                                    style={{ marginBottom: 8 }}>
                                    <Form.Item
                                      name={[questionField.name, "type"]}
                                      rules={[{ required: true }]}
                                      initialValue={"question"}
                                      hidden></Form.Item>
                                    <Form.Item
                                      name={[questionField.name, "id_quiz"]}
                                      rules={[{ required: true }]}
                                      initialValue={null}
                                      hidden></Form.Item>
                                    <Form.Item
                                      label="Question"
                                      name={[questionField.name, "question_text"]}
                                      rules={[
                                        { required: true, message: "La question est requise" },
                                      ]}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      label="Explication de la question"
                                      name={[questionField.name, "explanation"]}
                                      rules={[
                                        {
                                          required: false,
                                        },
                                      ]}>
                                      <Input.TextArea />
                                    </Form.Item>
                                    <Form.Item
                                      label="Choix multiple ?"
                                      name={[questionField.name, "is_multiple_choice"]}
                                      rules={[
                                        { required: true, message: "La question est requise" },
                                      ]}>
                                      <Radio.Group>
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                      </Radio.Group>
                                    </Form.Item>

                                    <Divider />

                                    <Form.Item label="Réponses">
                                      <Form.List name={[questionField.name, "answer_options"]}>
                                        {(answerFields, answersOpt) => (
                                          <div>
                                            {answerFields.map((answerField) => {
                                              return (
                                                <Card
                                                  key={answerField.key}
                                                  title={`Réponse ${answerField.name + 1}`}
                                                  extra={
                                                    <CloseOutlined
                                                      onClick={() => {
                                                        answersOpt.remove(answerField.name);
                                                      }}
                                                    />
                                                  }
                                                  style={{ marginBottom: 8 }}>
                                                  <Form.Item
                                                    name={[answerField.name, "key"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                      },
                                                    ]}
                                                    initialValue={questionField.key}
                                                    hidden></Form.Item>
                                                  <Form.Item
                                                    name={[answerField.name, "type"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                      },
                                                    ]}
                                                    initialValue={"answeroption"}
                                                    hidden></Form.Item>
                                                  <Form.Item
                                                    name={[answerField.name, "id_question"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                      },
                                                    ]}
                                                    initialValue={null}
                                                    hidden></Form.Item>
                                                  <Form.Item
                                                    label="Réponse"
                                                    name={[answerField.name, "answer_text"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message: "La réponse est requise",
                                                      },
                                                    ]}>
                                                    <Input />
                                                  </Form.Item>
                                                  <Form.Item
                                                    label="Bonne réponse ?"
                                                    name={[answerField.name, "correct"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "L'indication de la bonne réponse est requis",
                                                      },
                                                    ]}>
                                                    <Radio.Group>
                                                      <Radio value={true}>Oui</Radio>
                                                      <Radio value={false}>Non</Radio>
                                                    </Radio.Group>
                                                  </Form.Item>
                                                </Card>
                                              );
                                            })}
                                            <Button
                                              type="dashed"
                                              onClick={() => answersOpt.add()}
                                              block>
                                              + Add Réponse
                                            </Button>
                                          </div>
                                        )}
                                      </Form.List>
                                    </Form.Item>
                                  </Card>
                                ))}
                                <Button type="dashed" onClick={() => questionsOpt.add()} block>
                                  + Add Question
                                </Button>
                              </div>
                            )}
                          </Form.List>
                        </Form.Item>
                      </Card>
                    ))}
                  </div>
                )}
              </Form.List>
              {/* <Form.Item noStyle shouldUpdate>
                {() => (
                  <Typography>
                    <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                  </Typography>
                )}
              </Form.Item> */}
            </Form>
          </div>
        ))}
      </div>
    </>
  );
}
