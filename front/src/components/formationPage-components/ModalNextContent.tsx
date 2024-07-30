import { Modal } from "antd";
import { Dispatch, SetStateAction, useContext } from "react";
import { MainContext } from "../../contexts/MainContext";

interface ModalNextContentInterface {
  isNextContentOpen: boolean;
  setIsNextContentOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalNextContent({
  isNextContentOpen,
  setIsNextContentOpen,
}: ModalNextContentInterface) {
  const mainContext = useContext(MainContext);
  if (!mainContext) return null;

  // const { totalUserAnswersByFormation, totalQuestionsByFormation } = mainContext;

  const handleOk = () => {
    setIsNextContentOpen(false);
  };

  const handleCancel = () => {
    setIsNextContentOpen(false);
  };

  // useEffect(() => {
  //   console.log("totalQuestions: ", totalQuestionsByFormation);
  //   console.log("totalUserAnswer: ", totalUserAnswersByFormation);
  // }, [totalQuestionsByFormation, totalUserAnswersByFormation]);

  return <Modal open={isNextContentOpen} onOk={handleOk} onCancel={handleCancel}></Modal>;
}
