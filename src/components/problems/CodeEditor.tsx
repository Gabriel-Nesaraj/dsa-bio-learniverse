
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
    <div className={`${readOnly ? 'h-auto min-h-[200px] max-h-[400px]' : 'h-96'} bg-muted rounded-md font-mono text-sm flex flex-col overflow-auto`}>
      <div className="bg-muted-foreground/10 px-4 py-2 text-xs text-muted-foreground border-b">
        {language.charAt(0).toUpperCase() + language.slice(1)}
      </div>
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
        <div className="text-center p-2 text-muted-foreground text-xs">
          Read-only solution view
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
