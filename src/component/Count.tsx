import React, { type ReactElement, useState } from "react";

const Count = (): ReactElement => {
  const [count, setCount] = useState(0);
  function square(n: number): number {
    return n * n;
  }

  return (
    <div>
      {count}
      {square(1)}
      <button
        onClick={() => {
          setCount((pre) => pre + 1);
        }}>
        카운트
      </button>
    </div>
  );
};

export default Count;
