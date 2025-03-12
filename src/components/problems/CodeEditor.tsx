
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language, 
  code: initialCode, 
  onChange, 
  readOnly = false 
}) => {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="h-96 bg-muted font-mono text-sm flex flex-col">
      <textarea
        value={code}
        onChange={handleCodeChange}
        className="p-4 flex-grow overflow-auto bg-muted font-mono text-sm w-full resize-none focus:outline-none"
        style={{ tabSize: 2 }}
        readOnly={readOnly}
        placeholder="Write your solution here..."
        spellCheck="false"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
      />
      {readOnly && (
        <div className="text-center p-4 text-muted-foreground text-xs">
          Note: This is a simplified code editor representation. 
          In a real application, we would integrate Monaco Editor or CodeMirror.
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
