
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  source?: string;
}

interface LogTableProps {
  filters: {
    dateRange: { start: string; end: string };
    logLevel: string;
    keyword: string;
  };
}

const LogTable = ({ filters }: LogTableProps) => {
  const [sortField, setSortField] = useState<keyof LogEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 100;

  // Mock log data
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-06-03 14:30:25',
      level: 'ERROR',
      message: 'Database connection timeout after 30 seconds',
      source: 'db.service.js:45'
    },
    {
      id: '2',
      timestamp: '2024-06-03 14:30:20',
      level: 'WARN',
      message: 'High memory usage detected: 89% of available RAM',
      source: 'monitor.service.js:112'
    },
    {
      id: '3',
      timestamp: '2024-06-03 14:30:15',
      level: 'INFO',
      message: 'User authentication successful for user ID: 12345',
      source: 'auth.controller.js:67'
    },
    {
      id: '4',
      timestamp: '2024-06-03 14:30:10',
      level: 'DEBUG',
      message: 'Processing request payload size: 2.3KB',
      source: 'request.middleware.js:23'
    },
    {
      id: '5',
      timestamp: '2024-06-03 14:30:05',
      level: 'ERROR',
      message: 'Failed to validate JWT token: Token expired',
      source: 'auth.middleware.js:89'
    }
  ];

  const handleSort = (field: keyof LogEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-400 bg-red-400/10';
      case 'WARN': return 'text-yellow-400 bg-yellow-400/10';
      case 'INFO': return 'text-blue-400 bg-blue-400/10';
      case 'DEBUG': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const SortIcon = ({ field }: { field: keyof LogEntry }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Log Entries</h3>
        <div className="text-sm text-slate-400">
          Showing {entriesPerPage} of 15,432 entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  Timestamp
                  <SortIcon field="timestamp" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('level')}
              >
                <div className="flex items-center gap-2">
                  Level
                  <SortIcon field="level" />
                </div>
              </th>
              <th className="text-left py-3 px-4">Message</th>
              <th className="text-left py-3 px-4">Source</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-mono text-sm text-slate-300">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  {log.message}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400 font-mono">
                  {log.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-slate-400">
          Page {currentPage} of 155
        </div>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogTable;
