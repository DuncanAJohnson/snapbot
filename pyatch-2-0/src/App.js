import './assets/css/App.css';
import React, { useState, useEffect, useMemo, useRef } from "react";
import { python } from "@codemirror/lang-python";
import Pyodide from "./features/pyodide/pyodide";
import { useSelector, useDispatch } from 'react-redux';
import { updateText } from './features/textEditor/textEditorSlice';
import CodeMirror from '@uiw/react-codemirror';
import { pyodideUpdateStatus } from './features/pyodide/pyodideSlice';
import { PyodideStates } from './features/pyodide/pyodideConstants';

function App() {
  const ideText = useSelector((state) => state.textEditor.text);
  const pyodideStatus = useSelector((state) => state.pyodideState.status);
  const dispatch = useDispatch()

  const onChange = React.useCallback((value, viewUpdate) => {
    dispatch(updateText(value));
  }, []);

  return (
    <>
      <CodeMirror
        value={ideText}
        height="200px"
        extensions={[python()]}
        onChange={onChange}
      />
      <button onClick={() => {dispatch(pyodideUpdateStatus(PyodideStates.RUNNING));}}>Run</button>
      <button onClick={() => {dispatch(pyodideUpdateStatus(PyodideStates.HALTING));}}>Halt</button>
      <Pyodide pythonCode={ideText} status={pyodideStatus} />
    </>
  );
}

export default App;