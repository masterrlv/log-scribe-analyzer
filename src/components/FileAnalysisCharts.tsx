
import { StoredFile } from "../services/fileStorage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface FileAnalysisChartsProps {
  file: StoredFile;
}

const FileAnalysisCharts = ({ file }: FileAnalysisChartsProps) => {
  const { analysisData } = file;

  // Prepare data for pie chart
  const pieData = [
    { name: 'Errors', value: analysisData.errorCount, color: '#ef4444' },
    { name: 'Warnings', value: analysisData.warningCount, color: '#f59e0b' },
    { name: 'Info', value: analysisData.infoCount, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Prepare data for bar chart (top errors)
  const errorData = analysisData.topErrors.slice(0, 10);

  // Prepare data for line chart (time series)
  const timeSeriesData = analysisData.timeSeriesData || [];

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2">{file.name}</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm text-slate-400">Total Entries</h3>
            <p className="text-2xl font-bold">{formatNumber(analysisData.totalEntries)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm text-slate-400">Errors</h3>
            <p className="text-2xl font-bold text-red-400">{formatNumber(analysisData.errorCount)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm text-slate-400">Warnings</h3>
            <p className="text-2xl font-bold text-yellow-400">{formatNumber(analysisData.warningCount)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm text-slate-400">Info</h3>
            <p className="text-2xl font-bold text-green-400">{formatNumber(analysisData.infoCount)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Log Level Distribution Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Log Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Errors Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Top Error Messages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={errorData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis 
                type="category" 
                dataKey="message" 
                stroke="#9ca3af"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Line Chart */}
      {timeSeriesData.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Log Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="errorCount" stroke="#ef4444" strokeWidth={2} name="Errors" />
              <Line type="monotone" dataKey="warningCount" stroke="#f59e0b" strokeWidth={2} name="Warnings" />
              <Line type="monotone" dataKey="infoCount" stroke="#10b981" strokeWidth={2} name="Info" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FileAnalysisCharts;
