
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import FileUploader from "../components/FileUploader";

const UploadPage = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/analyze");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Upload Log File</h1>
            <p className="text-slate-300 text-sm">Support for .log, .txt files up to 50MB</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
            <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          </div>

          {/* File Info */}
          {uploadedFile && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                File Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <p className="font-medium">{uploadedFile.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Size:</span>
                  <p className="font-medium">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>
                  <p className="font-medium">{uploadedFile.type || 'text/plain'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Upload Guidelines
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Supported formats: .log, .txt files
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Maximum file size: 50MB
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Common log formats: Apache, Nginx, application logs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Processing time depends on file size (typically 1-30 seconds)
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
