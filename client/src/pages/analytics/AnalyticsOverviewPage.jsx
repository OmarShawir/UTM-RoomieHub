// Farah
import React, { useEffect, useState } from 'react';
import { getListingTrends, downloadAnalyticsReport } from '../../services/farahApi';
import Button from '../../components/Button';
import Card from '../../components/Card';

const AnalyticsOverviewPage = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await getListingTrends();
        setTrends(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytical data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const fileBlob = await downloadAnalyticsReport(format);
      const url = window.URL.createObjectURL(new Blob([fileBlob.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `UTM_RoomieHub_MarketReport_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to generate administrative export data compile.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-[#E5E7EB]">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Market Analytics & Trend Reports</h1>
          <p className="text-[#6B7280]">Historical tracking ledger for Skudai room price variance distributions.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleExport('csv')} disabled={exporting} className="border border-[#E5E7EB] bg-white text-[#111827]">
            Export Excel Raw Data (CSV)
          </Button>
          <Button onClick={() => handleExport('pdf')} disabled={exporting} style={{ backgroundColor: '#7B1E1E', color: '#FFF' }}>
            {exporting ? 'Compiling PDF...' : 'Download Executive Report (PDF)'}
          </Button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-[#EF4444] rounded border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-[#111827] mb-4">Average Rental Yield Across UTM Perimeters</h3>
          {trends?.priceDistribution ? (
            <div className="space-y-4">
              {trends.priceDistribution.map((zone, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm text-[#111827]">
                    <span className="font-medium">{zone.locationName}</span>
                    <span className="text-[#6B7280]">RM {zone.avgPrice} / month</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#7B1E1E] h-full transition-all duration-500" 
                      style={{ width: `${zone.relativeDensityPercentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Computing spatial price distribution patterns...</p>
          )}
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-[#111827] mb-4">Structural Layout Preferences</h3>
          {trends?.roomPreferences ? (
            <div className="flex flex-col justify-center h-full space-y-4">
              {trends.roomPreferences.map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded border border-[#E5E7EB]">
                  <span className="text-sm font-semibold text-[#111827]">{pref.type} Layouts</span>
                  <span className="text-xs font-bold text-white px-2.5 py-1 bg-[#10B981] rounded-full">
                    {pref.sharePercentage}% Market Demand
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Aggregating functional search query profiles...</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOverviewPage;
