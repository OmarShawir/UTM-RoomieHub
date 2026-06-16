// Farah
import React, { useEffect, useState } from 'react';
import { getAdminDashboardStats } from '../../services/farahApi';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-12 text-[#6B7280]">Querying structural system data matrices...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Administrative Dashboard Center</h1>
        <p className="text-[#6B7280]">Analytics and trust monitoring center for room postings and user verification maps.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-[#EF4444] rounded border border-red-200">{error}</div>}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-l-4 border-l-[#7B1E1E]">
            <h3 className="text-sm font-medium text-[#6B7280] uppercase">Total Verified Students</h3>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.totalUsers}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-amber-500">
            <h3 className="text-sm font-medium text-[#6B7280] uppercase">Active Room Postings</h3>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.activeListings}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-[#10B981]">
            <h3 className="text-sm font-medium text-[#6B7280] uppercase">Successful AI Matches</h3>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.successfulMatches}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-[#EF4444]">
            <h3 className="text-sm font-medium text-[#6B7280] uppercase">Open Moderation Complaints</h3>
            <p className="text-3xl font-bold text-[#111827] mt-2 flex items-center justify-between">
              {stats.flaggedReports}
              {stats.flaggedReports > 0 && <Badge variant="error">Action Required</Badge>}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
