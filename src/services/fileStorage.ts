
export interface StoredFile {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  userId: string;
  analysisData: {
    totalEntries: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    timeRange: {
      start: string;
      end: string;
    };
    topErrors: Array<{
      message: string;
      count: number;
    }>;
    timeSeriesData: Array<{
      timestamp: string;
      errorCount: number;
      warningCount: number;
      infoCount: number;
    }>;
  };
}

class FileStorageService {
  private getStorageKey(userId: string): string {
    return `log_files_${userId}`;
  }

  private getUploadsFolder(): string {
    return 'uploads';
  }

  private getParsedDataFolder(): string {
    return 'parsed_data';
  }

  saveFile(file: File, analysisData: any, userId: string): StoredFile {
    const storedFile: StoredFile = {
      id: Date.now().toString(),
      name: file.name,
      uploadDate: new Date().toISOString(),
      size: file.size,
      userId,
      analysisData
    };

    // Get existing files for this user
    const existingFiles = this.getUserFiles(userId);
    existingFiles.push(storedFile);

    // Save to localStorage (in a real app, this would be a proper database)
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(existingFiles));

    // In a real app, we would save the actual file to the uploads folder
    // and the parsed data to the parsed_data folder
    console.log(`Would save file to: ${this.getUploadsFolder()}/${storedFile.id}_${file.name}`);
    console.log(`Would save analysis to: ${this.getParsedDataFolder()}/${storedFile.id}_analysis.json`);

    return storedFile;
  }

  getUserFiles(userId: string): StoredFile[] {
    const stored = localStorage.getItem(this.getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  }

  getFileById(fileId: string, userId: string): StoredFile | null {
    const files = this.getUserFiles(userId);
    return files.find(file => file.id === fileId) || null;
  }

  deleteFile(fileId: string, userId: string): boolean {
    const files = this.getUserFiles(userId);
    const filteredFiles = files.filter(file => file.id !== fileId);
    
    if (filteredFiles.length !== files.length) {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(filteredFiles));
      return true;
    }
    return false;
  }
}

export const fileStorage = new FileStorageService();
