
import React from 'react';

interface CodeEditorProps {
  language: string;
  code: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code }) => {
  return (
    <div className="p-4 h-96 overflow-auto bg-muted font-mono text-sm">
      <pre className="whitespace-pre-wrap">{code}</pre>
      <div className="text-center mt-4 text-muted-foreground text-xs">
        Note: This is a simplified code editor representation. 
        In a real application, we would integrate Monaco Editor or CodeMirror.
      </div>
    </div>
  );
};

export default CodeEditor;
