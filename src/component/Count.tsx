import React, { type ReactElement, useState } from "react";
import "../css/count.scss";

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
    </div>
  );
};

export default Count;
