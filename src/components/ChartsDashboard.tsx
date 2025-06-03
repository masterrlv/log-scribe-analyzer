
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const ChartsDashboard = () => {
  // Mock data for charts
  const logLevelData = [
    { name: 'ERROR', value: 234, color: '#ef4444' },
    { name: 'WARN', value: 567, color: '#f59e0b' },
    { name: 'INFO', value: 1234, color: '#3b82f6' },
    { name: 'DEBUG', value: 892, color: '#6b7280' }
  ];

  const timelineData = [
    { time: '00:00', errors: 5, warnings: 12 },
    { time: '04:00', errors: 3, warnings: 8 },
    { time: '08:00', errors: 15, warnings: 25 },
    { time: '12:00', errors: 22, warnings: 35 },
    { time: '16:00', errors: 18, warnings: 28 },
    { time: '20:00', errors: 8, warnings: 15 }
  ];

  const hourlyDistribution = [
    { hour: '0', count: 45 },
    { hour: '1', count: 32 },
    { hour: '2', count: 28 },
    { hour: '3', count: 35 },
    { hour: '4', count: 42 },
    { hour: '5', count: 55 },
    { hour: '6', count: 78 },
    { hour: '7', count: 95 },
    { hour: '8', count: 125 },
    { hour: '9', count: 145 },
    { hour: '10', count: 132 },
    { hour: '11', count: 128 },
    { hour: '12', count: 155 },
    { hour: '13', count: 142 },
    { hour: '14', count: 138 },
    { hour: '15', count: 125 },
    { hour: '16', count: 115 },
    { hour: '17', count: 98 },
    { hour: '18', count: 85 },
    { hour: '19', count: 72 },
    { hour: '20', count: 65 },
    { hour: '21', count: 55 },
    { hour: '22', count: 48 },
    { hour: '23', count: 38 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-1">Total Entries</h3>
          <p className="text-2xl font-bold text-white">15,432</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-1">Errors</h3>
          <p className="text-2xl font-bold text-red-400">234</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-1">Warnings</h3>
          <p className="text-2xl font-bold text-yellow-400">567</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-sm text-slate-400 mb-1">Error Rate</h3>
          <p className="text-2xl font-bold text-blue-400">1.52%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Level Distribution */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Log Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={logLevelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {logLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Error Timeline */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Error Timeline (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="warnings" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Hourly Log Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsDashboard;
