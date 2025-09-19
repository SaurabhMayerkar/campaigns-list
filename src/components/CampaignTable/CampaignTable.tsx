import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Campaign, CampaignWithStatus } from '@/types/campaign.types';
import './CampaignTable.css';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  const users = useAppSelector((state) => state.users.users);

  // Memoize campaign data processing to avoid recalculating on every render
  // when dependencies (campaigns, users) haven't changed
  const campaignsWithStatus = useMemo<CampaignWithStatus[]>(() => {
    const currentDate = new Date();
    return campaigns.map((campaign) => {
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);
      const isActive = currentDate >= startDate && currentDate <= endDate;
      const user = users.find((u) => u.id === campaign.userId);
      
      return {
        ...campaign,
        isActive,
        userName: user?.name || 'Unknown User',
      };
    });
  }, [campaigns, users]);

  /**
   * Format currency amount to USD format
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (campaignsWithStatus.length === 0) {
    return (
      <div className="campaign-table-empty">
        <p>No campaigns found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="campaign-table-container">
      <table className="campaign-table">
        <thead>
          <tr className="table-header">
            <th>Campaign Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Budget</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {campaignsWithStatus.map((campaign) => (
            <tr key={campaign.id} className="table-row">
              <td>
                <span className="campaign-name">{campaign.name}</span>
              </td>
              <td>
                <span className="campaign-date">{formatDate(campaign.startDate)}</span>
              </td>
              <td>
                <span className="campaign-date">{formatDate(campaign.endDate)}</span>
              </td>
              <td>
                <span className={`status-chip ${campaign.isActive ? 'active' : 'inactive'}`}>
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <span className="campaign-budget">{formatCurrency(campaign.budget)}</span>
              </td>
              <td>
                <span className="campaign-user">{campaign.userName ? campaign.userName : 'Unknown User'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};