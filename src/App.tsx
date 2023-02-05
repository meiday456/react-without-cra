import React from "react"
import "./css/main.css"
import Count from "./component/Count";
import SampleImage from "../public/images/sample.jpg"

const App = () => {
    return (
        <h1>
            Hello world! without cra create app!
            <p>font style check</p>
            <Count/>
            <img src={SampleImage} alt="도로 이미지" style={{width : "200px"}}/>
        </h1>
    )
}

export default App