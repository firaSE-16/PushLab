import clsx from 'clsx';
import React from 'react';
import { Tabs } from '~/components/ui/tabs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  filesReferences: {
    fileName: string;
    sourceCode: string;
    summary: string[];
  }[];
};

const CodeReferences = ({ filesReferences }: Props) => {
  const [tab, setTab] = React.useState(filesReferences[0]?.fileName || '');

  return (
    <div className="max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-auto flex gap-2 bg-gray-200 p-1 rounded-md mb-2">
          {filesReferences.map((file) => (
            <button
              key={file.fileName}
              className={clsx(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                tab === file.fileName
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-gray-300'
              )}
              onClick={() => setTab(file.fileName)}
            >
              {file.fileName}
            </button>
          ))}
        </div>

        <div className="max-h-[40vh] overflow-auto rounded-md">
          {filesReferences.map(
            (file) =>
              tab === file.fileName && (
                <div key={file.fileName}>
                  <SyntaxHighlighter
                    language="typescript"
                    style={oneDark}
                    customStyle={{
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {file.sourceCode}
                  </SyntaxHighlighter>
                </div>
              )
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeReferences;
