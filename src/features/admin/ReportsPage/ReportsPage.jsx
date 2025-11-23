import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../../components/Card';
import useAppStore from '../../../store/useAppStore';
import { generatePDFReport, generateExcelReport, generateChartData, calculateMetrics } from '../../../services/reportsService';
import gsap from 'gsap';

const ReportsPage = () => {
  const { patients, alerts, contactData } = useAppStore();
  const [reportType, setReportType] = useState('compliance');
  const containerRef = useRef(null);

  const metrics = calculateMetrics(patients, contactData || [], alerts);
  const statusChartData = generateChartData(patients, 'status');

  const timelineData = [
    { date: 'Nov 5', cases: 2, contacts: 8 },
    { date: 'Nov 6', cases: 3, contacts: 12 },
    { date: 'Nov 7', cases: 1, contacts: 5 },
    { date: 'Nov 8', cases: 4, contacts: 15 },
    { date: 'Nov 9', cases: 2, contacts: 9 },
    { date: 'Nov 10', cases: 3, contacts: 11 },
  ];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleGeneratePDF = () => {
    generatePDFReport(metrics, reportType);
  };

  const handleGenerateExcel = () => {
    generateExcelReport(patients, 'patients');
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance & Audit Reports</h1>
          <p className="text-gray-700 mt-1 font-medium">Analytics and compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateExcel}
            className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <i className="ri-file-excel-line"></i>
            Export Excel / Excel Nikalo
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-cta-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <i className="ri-file-pdf-line"></i>
            Generate PDF Report / PDF Banao
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">MDR Positive</p>
              <h3 className="text-4xl font-bold mt-2">{metrics.mdrPositive}</h3>
            </div>
            <i className="ri-alert-line text-5xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Direct Contacts</p>
              <h3 className="text-4xl font-bold mt-2">{metrics.directContacts}</h3>
            </div>
            <i className="ri-group-line text-5xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Indirect Contacts</p>
              <h3 className="text-4xl font-bold mt-2">{metrics.indirectContacts}</h3>
            </div>
            <i className="ri-link text-5xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Alerts Triggered</p>
              <h3 className="text-4xl font-bold mt-2">{metrics.alertsTriggered}</h3>
            </div>
            <i className="ri-notification-3-line text-5xl opacity-50"></i>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Patient Status Distribution" icon="ri-pie-chart-line">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Cases & Contacts Timeline" icon="ri-line-chart-line">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="contacts" stroke="#4AA3C3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Compliance Details */}
      <Card title="Compliance Metrics" icon="ri-bar-chart-box-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-primary-teal pl-4">
            <p className="text-sm text-gray-600">Median Time to Isolation</p>
            <p className="text-3xl font-bold text-dark-text mt-1">{metrics.medianIsolationTime}h</p>
          </div>
          <div className="border-l-4 border-cta-green pl-4">
            <p className="text-sm text-gray-600">Total Patients Traced</p>
            <p className="text-3xl font-bold text-dark-text mt-1">{metrics.totalPatients}</p>
          </div>
          <div className="border-l-4 border-accent-blue pl-4">
            <p className="text-sm text-gray-600">System Uptime</p>
            <p className="text-3xl font-bold text-dark-text mt-1">99.8%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
