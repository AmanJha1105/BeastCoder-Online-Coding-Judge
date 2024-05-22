import React,{useState} from 'react'
import Editor from 'react-simple-code-editor';
import axios from'axios';
import toast from"react-hot-toast";
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';


const Code = ({quesID})=> {

  const demoCode =[`#include <iostream> 
    using namespace std;
    // Define the main function
    int main() { 
        //Write your code here
        return 0;  
    }`,
    `#include <stdio.h> 
    // Define the main function
    int main() { 
        //Write your code here
        return 0;  
    }`,
    `import java.util.Scanner;

    public class Main {
      public static void main(String[] args) 
      {
        //write your code here
      }
    }`,
    `# write your code here`  
  ]
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const[language,setLanguage]=useState('cpp');
  const [code, setCode] = useState(demoCode[0]);
  
  const handleRun = async () => {
    const payload = {
      language,
      code,
      input
    };

    try {
      // console.log("inside try block in code");
      const  outputContent = await axios.post('http://localhost:5000/ques/run', payload);
      console.log(outputContent);
      setOutput(outputContent.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      language,
      code,
      quesID,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      console.log("inside try block in code");
      const { data } = await axios.post('http://localhost:5000/ques/submit', payload,config);
      console.log("data received",data.finalVerdict);
      if(data.finalVerdict==="AC")
      {
        console.log("accepted");
        toast.success("All testcases passed");
      }
      setOutput(data.finalVerdict);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOptionChange = (e)=>{
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    let newChoice;
    switch (selectedLanguage) {
      case 'py':
        newChoice = 3;
        break;
      case 'java':
        newChoice = 2;
        break;
      case 'c':
        newChoice = 1;
        break;
      case 'cpp':
      default:
        newChoice = 0;
        break;
    }
    setCode(demoCode[newChoice]);
  }

  return (
    <div className="container mx-auto py-8 flex flex-col lg:flex-row items-stretch">
      {/* Left side: Compiler editor */}
      <div className="lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold mb-3">Beast Coder Online Code Compiler</h1>
        <div className="bg-gray-100 shadow-md w-full max-w-lg mb-4" style={{ width: '100%', 
      height: '100vh', overflowY: 'auto',resize:'both' }}>

        <select onChange={handleOptionChange}>
        <optgroup label="Language">
            <option name="table1" value="cpp">c++</option>
            <option name="table2" value="py">python</option>
            <option name="table3" value="java">Java</option>
            <option name="table4" value="c">C</option>
        </optgroup>
    </select>

          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: 'none',
              border: 'none',
              backgroundColor: '#f7fafc',
              // height: '100%',
              minHeight: '100%',
              resize:'both',
              overflowY: 'auto'
            }}
          />
        </div>

        {/* Run button */}
        <button onClick={handleRun} type="button" className="w-full text-center mt-4 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle me-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
          Run
        </button>

        {/* Run button */}
        <button onClick={handleSubmit} type="button" className="w-full text-center mt-4 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle me-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>
          Submit
        </button>

      </div>

      {/* Right side: Input and Output */}
      <div className="lg:w-1/2 lg:pl-8 pt-10">
        {/* Input textarea */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            rows='5'
            cols='15'
            value={input}
            placeholder='Input'
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
            style={{ minHeight: '100px' }}
          ></textarea>
        </div>

        {/* Output box */}
        {(
          <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          <textarea
            rows='5'
            cols='15'
            value={output}
            placeholder='Output'
            onChange={(e) => setOutput(e.target.value)}
            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
            style={{ minHeight: '100px' }}
          ></textarea>
        </div>
        )}
      </div>
    </div>
  );
}

export default Code