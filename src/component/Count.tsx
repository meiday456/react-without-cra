import React, { type ReactElement, useState } from "react";
import "../css/count.scss";
import styled from "@emotion/styled";

const DivBlock = styled.div`
  background-color: #0c4128;
`;

const Count = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <div className={"container"}>
      {count}
      <button
        className={"btn"}
        onClick={() => {
          setCount((pre) => pre + 1);
        }}>
        카운트
      </button>
      <DivBlock>styled 영역</DivBlock>
    </div>
  );
};

export default Count;
