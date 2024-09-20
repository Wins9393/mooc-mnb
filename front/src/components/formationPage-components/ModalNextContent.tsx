import { Button, Modal } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Formation, ScoreAndCompletionByFormation } from "../../types/types";

interface ModalNextContentInterface {
  isNextContentOpen: boolean;
  setIsNextContentOpen: Dispatch<SetStateAction<boolean>>;
  currentFormation: Formation | null;
  progress: ScoreAndCompletionByFormation | undefined;
}

export function ModalNextContent({ isNextContentOpen, setIsNextContentOpen, currentFormation, progress }: ModalNextContentInterface) {
  const [score, setScore] = useState<number>(0);
  const handleOk = () => {
    setIsNextContentOpen(false);
  };

  function getFormationScore(progress: ScoreAndCompletionByFormation | undefined) {
    let initialValue = 0;
    const score = progress?.quizzes_completion.reduce((acc, current) => acc + current.score, initialValue);
    if (score && progress) {
      console.log("score: ", (score / progress.total_quizzes).toFixed(1));
      setScore(parseFloat((score / progress.total_quizzes).toFixed(1)));
      return (score / progress.total_quizzes).toFixed(1);
    }
  }

  useEffect(() => {
    getFormationScore(progress);
  }, [progress]);

  return (
    <Modal
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
      open={isNextContentOpen}
      onOk={handleOk}
      style={{ minWidth: "800px" }}
      styles={{ content: { padding: "32px" } }}
      title={"Formation terminée"}
    >
      <div style={{ width: "100%" }}>
        {score === 100 ? (
          <video style={{ maxWidth: "100%" }} autoPlay muted src="/gold.mp4"></video>
        ) : (
          <video style={{ maxWidth: "100%" }} autoPlay muted src="/silver.mp4"></video>
        )}
      </div>
    </Modal>
  );
}
