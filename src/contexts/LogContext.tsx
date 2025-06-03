
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LogEntry, LogAnalysis } from '../services/logParser';

interface LogContextType {
  logEntries: LogEntry[];
  logAnalysis: LogAnalysis | null;
  uploadedFileName: string | null;
  setLogData: (entries: LogEntry[], analysis: LogAnalysis, fileName: string) => void;
  clearLogData: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
};

interface LogProviderProps {
  children: ReactNode;
}

export const LogProvider = ({ children }: LogProviderProps) => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [logAnalysis, setLogAnalysis] = useState<LogAnalysis | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const setLogData = (entries: LogEntry[], analysis: LogAnalysis, fileName: string) => {
    setLogEntries(entries);
    setLogAnalysis(analysis);
    setUploadedFileName(fileName);
  };

  const clearLogData = () => {
    setLogEntries([]);
    setLogAnalysis(null);
    setUploadedFileName(null);
  };

  return (
    <LogContext.Provider value={{
      logEntries,
      logAnalysis,
      uploadedFileName,
      setLogData,
      clearLogData
    }}>
      {children}
    </LogContext.Provider>
  );
};
