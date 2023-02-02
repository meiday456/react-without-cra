import React from "react";
import {useState} from "react";

const Count = () => {

    const [count, setCount] = useState(0)

    function square(n: number): number {
        return n * n
    }

    return (
        <div>
            {count}
            <button onClick={() => setCount(pre => pre + 1)}>카운트</button>
        </div>

    )
}


export default Count