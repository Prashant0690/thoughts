import React from 'react';
import { CopyBlock, monoBlue } from "react-code-blocks";
import './App.css';


function App() {
  return (
    <div>
      <div style={{fontFamily: 'Fira Code', textAlign: 'left'}}>
            <h1>Blog</h1>
            <CopyBlock
                text={code2}
                language={'java'}
                showLineNumbers={false}
                theme = {monoBlue}
                wrapline
            />
        </div>
      
    </div>
  );
}

let code2 = `

Hello World!!!!!!!!!!
Hello World!!!!!!!!!!

`;

export default App;
