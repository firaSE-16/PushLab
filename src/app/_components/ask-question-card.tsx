"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Box, FileText, RefreshCw, AlertCircle, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';


type SourceFile = {
  fileName: string;
  similarity?: number;
  lastUpdated?: string;
  sourceCode?: string;
  language?: string;
};

const AskQuestionCard = ({ projectId }: { projectId: string }) => {
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [response, setResponse] = useState<{
    answer: string;
    sources: SourceFile[];
    error?: string;
  } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setResponse(null);
    setLoading(true);
    setOpen(true);

    try {
      // Simulated response
      setTimeout(() => {
        setResponse({
          answer: `Great question about a major upgrade in our codebase—our adoption of LangChain Expression Language (LCEL)!

Yes, our chains.py file has been refactored away from older LangChain constructs like RetrievalQAWithSourcesChain to newer LCEL components.`,
          sources: [
            {
              fileName: "chains.py",
              similarity: 0.95,
              lastUpdated: "2023-11-15T14:30:00Z",
              language: "python",
              sourceCode: `from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

def create_retrieval_chain(retriever, llm, prompt):
    setup_and_retrieval = RunnableParallel({
        "context": retriever,
        "question": RunnablePassthrough()
    })

    return (
        setup_and_retrieval
        | prompt
        | llm
        | StrOutputParser()
    )`
            },
            {
              fileName: "config.py",
              similarity: 0.82,
              lastUpdated: "2023-11-10T09:15:00Z",
              language: "python",
              sourceCode: `# LCEL Configuration
LCEL_CONFIG = {
    "max_concurrency": 4,
    "timeout": 30,
    "verbose": False
}`
            }
          ]
        });
        setActiveTab("chains.py");
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Analysis error:", err);
      setResponse({
        answer: "Analysis failed",
        sources: [],
        error: err instanceof Error ? err.message : "Unknown error",
      });
      setLoading(false);
    }
  };

  const formatSimilarity = (similarity?: number) => {
    if (!similarity) return null;
    return `${(similarity * 100).toFixed(1)}% match`;
  };

  const formatCode = (code?: string, language: string = "text") => {
    if (!code) return <p className="text-sm text-muted-foreground">No code available</p>;

    return (
      <SyntaxHighlighter
        language={"python"}
        style={atomOneDark}
        customStyle={{
          borderRadius: "0.5rem",
          padding: "1rem",
          fontSize: "0.85rem",
          overflowX: "hidden"
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="!p-6 !absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] h-screen max-h-screen flex flex-col overflow-hidden rounded-lg shadow-xl bg-background"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Code className="h-5 w-5 text-blue-500" />
              Code Analysis Results
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-sm font-medium text-gray-700">Analyzing codebase...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden gap-4">
              {response?.error && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error</h4>
                    <p className="text-xs text-red-700">{response.error}</p>
                  </div>
                </div>
              )}

              {/* Answer Section */}
              <div className="border bg-background rounded-md p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Box className="h-4 w-4 text-blue-500" />
                  Analysis Summary
                </h3>
                <div className="text-sm text-foreground space-y-2">
                  {response?.answer.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Referenced Files Tabs */}
              {response?.sources && response.sources.length > 0 && (
                <div className="flex-1 flex flex-col overflow-hidden border rounded-md">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <TabsList className="flex overflow-x-auto p-2 border-b rounded-none bg-muted">
                      {response.sources.map((source, index) => (
                        <TabsTrigger
                          key={index}
                          value={source.fileName}
                          className="flex items-center gap-2 text-xs px-3 py-1.5 whitespace-nowrap"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-[120px]">{source.fileName}</span>
                          {source.similarity && (
                            <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                              {formatSimilarity(source.similarity)}
                            </span>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                      {response.sources.map((source, index) => (
                        <TabsContent
                          key={index}
                          value={source.fileName}
                          className="h-full"
                        >
                          <div className="flex flex-col h-full">
                            <div className="p-3 border-b">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium truncate">{source.fileName}</h4>
                                {source.lastUpdated && (
                                  <p className="text-xs text-muted-foreground">
                                    Updated: {new Date(source.lastUpdated).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ScrollArea className="flex-1 p-4 overflow-y-auto">
                              {formatCode(source.sourceCode, source.language)}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ask Form */}
      <Card className="border bg-background">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Code className="h-5 w-5 text-blue-500" />
            Ask About This Codebase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Textarea
              placeholder="Example: Where is the main API endpoint defined?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] text-sm"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Ask about any part of the codebase
              </p>
              <Button
                type="submit"
                disabled={loading}
                className="text-sm gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" />
                    Ask Codebase
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
