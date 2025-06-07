
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Download, Trash2, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fileStorage, StoredFile } from "../services/fileStorage";
import { Button } from "../components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import FileAnalysisCharts from "../components/FileAnalysisCharts";
import ChatInterface from "../components/ChatInterface";

const HistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);

  useEffect(() => {
    if (user) {
      const userFiles = fileStorage.getUserFiles(user.id);
      setFiles(userFiles);
    }
  }, [user]);

  const handleDeleteFile = (fileId: string) => {
    if (user && fileStorage.deleteFile(fileId, user.id)) {
      const updatedFiles = fileStorage.getUserFiles(user.id);
      setFiles(updatedFiles);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-slate-300 mb-6">Please log in to view your file history.</p>
          <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-400">File History</h1>
            <p className="text-slate-300 text-sm">{files.length} uploaded files</p>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - File List */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full bg-slate-800 border-r border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold">Your Files</h2>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {files.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No files uploaded yet</p>
                    <Link to="/upload" className="text-blue-400 hover:text-blue-300 text-sm">
                      Upload your first file
                    </Link>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedFile?.id === file.id
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{file.name}</h3>
                            <div className="text-xs text-slate-400 space-y-1 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(file.uploadDate)}
                              </div>
                              <div>{formatFileSize(file.size)}</div>
                              <div>{file.analysisData.totalEntries.toLocaleString()} entries</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Analysis and Chat */}
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              {/* Top Panel - Analysis Charts */}
              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="h-full bg-slate-900 p-6">
                  {selectedFile ? (
                    <FileAnalysisCharts file={selectedFile} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Select a file to view analysis</h3>
                        <p>Choose a file from the left panel to see its charts and insights</p>
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Bottom Panel - Chat Interface */}
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="h-full bg-slate-800 border-t border-slate-700">
                  <ChatInterface selectedFile={selectedFile} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default HistoryPage;
