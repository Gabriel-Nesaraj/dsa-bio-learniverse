
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

  const getLanguageSpecificStyling = () => {
    switch(language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'text-yellow-500';
      case 'python':
        return 'text-blue-500';
      case 'java':
        return 'text-amber-600';
      case 'c++':
      case 'cpp':
        return 'text-purple-500';
      default:
        return '';
    }
  };

  return (
    <div className={`${readOnly ? 'h-auto min-h-[200px] max-h-[400px]' : 'h-96'} bg-muted rounded-md font-mono text-sm flex flex-col overflow-auto border`}>
      <div className={`px-4 py-2 text-xs border-b flex items-center justify-between ${getLanguageSpecificStyling()}`}>
        <span className="font-medium">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        {!readOnly && (
          <Select defaultValue={language}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        )}
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
        <div className="text-center p-2 text-muted-foreground text-xs border-t">
          Read-only solution view
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
