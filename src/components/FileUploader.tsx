
import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { logParser } from "../services/logParser";
import { useLogContext } from "../contexts/LogContext";
import { useAuth } from "../contexts/AuthContext";
import { fileStorage } from "../services/fileStorage";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const FileUploader = ({ onFileUpload, isProcessing, setIsProcessing }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLogData } = useLogContext();
  const { user, isAuthenticated } = useAuth();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to upload files');
      return;
    }

    // Validate file type
    const validTypes = ['.log', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert('Please upload a .log or .txt file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Read file content
      const content = await file.text();
      console.log('File content length:', content.length);
      
      // Parse the log file
      const logEntries = logParser.parseLogFile(content);
      console.log('Parsed log entries:', logEntries.length);
      
      // Analyze the log entries
      const analysis = logParser.analyzeLogEntries(logEntries);
      console.log('Log analysis:', analysis);

      // Prepare analysis data for storage
      const analysisData = {
        totalEntries: analysis.totalEntries,
        errorCount: analysis.errorCount,
        warningCount: analysis.warningCount,
        infoCount: analysis.infoCount,
        timeRange: analysis.timeRange,
        topErrors: analysis.topErrors,
        timeSeriesData: analysis.timeSeriesData || []
      };
      
      // Save file to storage
      const storedFile = fileStorage.saveFile(file, analysisData, user.id);
      console.log('File saved to storage:', storedFile);
      
      // Store in context for immediate use
      setLogData(logEntries, analysis, file.name);
      
      // Notify parent component
      onFileUpload(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing the log file. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
        <p className="text-slate-400 mb-4">Please log in to upload and analyze log files.</p>
        <a href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Go to Login
        </a>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Processing Log File</h3>
        <p className="text-slate-400">Parsing entries and extracting insights...</p>
      </div>
    );
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
        ${isDragOver 
          ? 'border-blue-400 bg-blue-400/10' 
          : 'border-slate-600 hover:border-slate-500'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".log,.txt"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-slate-700 rounded-full">
          <Upload className="w-8 h-8 text-blue-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Log File</h3>
          <p className="text-slate-400 mb-4">
            Drag and drop your .log or .txt file here, or click to browse
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <FileText className="w-4 h-4" />
            Supports .log, .txt files up to 50MB
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Choose File
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
