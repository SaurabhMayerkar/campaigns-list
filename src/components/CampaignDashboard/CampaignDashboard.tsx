/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers } from '@/store/slices/userSlice';
import { CampaignTable } from '../CampaignTable/CampaignTable';
import { SearchFilters } from '../SearchFilters/SearchFilters';
import { Campaign } from '@/types/campaign.types';
import './CampaignDashboard.css';
import { RootState } from '@/store/store';
import { addCampaigns } from '@/store/slices/campaignSlice';

/**
 * CampaignDashboard Component
 * Main dashboard for managing and viewing marketing campaigns
 * Features search, filtering, and campaign management capabilities
 */
export const CampaignDashboard = () => {
  const dispatch = useAppDispatch();

  const campaignsLoading = useAppSelector((state: RootState) => state.campaigns.loading);
  const campaigns = useAppSelector((state: RootState) => state.campaigns.campaigns);
  const users = useAppSelector((state: RootState) => state.users.users);
  const usersLoading = useAppSelector((state: RootState) => state.users.loading);
  const usersError = useAppSelector((state: RootState) => state.users.error);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  /**
   * Memoized filtered campaigns based on search term and date range
   * Applies both text search and date range filtering to campaign list
   */
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Name filter
      const matchesName = campaign.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Date range filter - parse MM/DD/YYYY format
      const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      const campaignStart = parseDate(campaign.startDate);
      const campaignEnd = parseDate(campaign.endDate);

      let matchesDateRange = true;
      if (startDate || endDate) {
        matchesDateRange = false;

        // If end date is before start date, don't show any campaigns
        if (startDate && endDate && endDate < startDate) {
          matchesDateRange = false;
        }

        // Both start and end dates selected
        else if (startDate && endDate) {
          matchesDateRange = (campaignStart >= startDate && campaignStart <= endDate);
        }

        // Only start date selected - show campaigns starting on or after this date
        else if (startDate) {
          matchesDateRange = campaignStart >= startDate;
        }

        // Only end date selected - show campaigns ending on or before this date
        else if (endDate) {
          matchesDateRange = campaignEnd <= endDate;
        }
      }

      return matchesName && matchesDateRange;
    });
  }, [campaigns, searchTerm, startDate, endDate]);


  /**
   * Enhances campaigns with user names for display purposes
   * Maps user IDs to actual user names for better readability
   */
  const campaignsWithUserNames = useMemo(() => {
    const getUserNameById = (userId: number): string => {
      const user = users.find(user => user.id === userId);
      return user ? user.name : 'Unknown User';
    };

    return filteredCampaigns.map(campaign => ({
      ...campaign,
      userName: getUserNameById(campaign.userId)
    }));
  }, [filteredCampaigns, users]);

  /**
   * Resets all search and filter criteria to their default values
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  /**
    * Global method for testing - exposes AddCampaigns function to window object
    * Allows external scripts to add campaigns for testing/demo purposes
  */
  useEffect(() => {
    dispatch(fetchUsers());

    (window as any).AddCampaigns = (newCampaigns: Campaign[]) => {
      if (Array.isArray(newCampaigns)) {
        dispatch(addCampaigns(newCampaigns));
        console.log(`${newCampaigns.length} campaign(s) have been added successfully.`);
      } else {
        console.error('AddCampaigns expects an array of campaigns');
      }
    };

    return () => {
      delete (window as any).AddCampaigns;
    };
  }, [dispatch]);

  return (
    <div className="campaign-dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Campaign Management Dashboard
        </h1>
      </div>

      {usersError && (
        <div className="error-alert">
          Error Loading Users: {usersError}
        </div>
      )}

      <div className="filters-panel">
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onClearFilters={handleClearFilters}
        />
      </div>

      {!usersLoading && users.length > 0 ?
        (
          <div className="campaign-table-panel">
            <div className="table-header">
              <h2 className="table-title">
                Campaigns {filteredCampaigns.length !== campaigns.length && `(${filteredCampaigns.length} of ${campaigns.length})`}
              </h2>
              <p className="table-subtitle">
                {usersLoading ? 'Loading user data...'
                  : `Showing ${filteredCampaigns.length} campaign${filteredCampaigns.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <CampaignTable campaigns={campaignsWithUserNames} />
          </div>
        )
        :
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading user data...</p>
        </div>
      }
    </div>
  );
};