/* eslint-disable @typescript-eslint/no-explicit-any */
// CampaignDashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers } from '@/store/slices/userSlice';
import { CampaignTable } from '../CampaignTable/CampaignTable';
import { SearchFilters } from '../SearchFilters/SearchFilters';
import { Campaign } from '@/types/campaign.types';
import './CampaignDashboard.css';
import { RootState } from '@/store/store';
import { addCampaigns } from '@/store/slices/campaignSlice';

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

  // CampaignDashboard.tsx - in the filteredCampaigns useMemo
  const filteredCampaigns = useMemo(() => {
    console.log(campaigns)
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
          // Campaign has start date within the range OR end date within the range
          matchesDateRange =
            (campaignStart >= startDate && campaignStart <= endDate) // Start date in range
        }
        // Only start date selected
        else if (startDate) {
          // Campaign starts on or after start date
          matchesDateRange = campaignStart >= startDate;
        }
        // Only end date selected
        else if (endDate) {
          // Campaign ends on or before end date
          matchesDateRange = campaignEnd <= endDate;
        }
      }

      return matchesName && matchesDateRange;
    });
  }, [campaigns, searchTerm, startDate, endDate]);


  // Enhance campaigns with user names for display
  const campaignsWithUserNames = useMemo(() => {
    const getUserNameById = (userId: number): string => {
      console.log(users)
      const user = users.find(user => user.id === userId);
      return user ? user.name : 'Unknown User';
    };

    return filteredCampaigns.map(campaign => ({
      ...campaign,
      userName: getUserNameById(campaign.userId)
    }));
  }, [filteredCampaigns, users]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  // Global method for testing
  useEffect(() => {
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

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="campaign-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Campaign Management Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Manage and monitor your marketing campaigns
        </p>
      </div>

      {/* Error Alert */}
      {usersError && (
        <div className="error-alert">
          Error Loading Users: {usersError}
        </div>
      )}


      {/* Search and Filters */}
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

      {/* Add Campaign Form */}
      {!usersLoading && users.length > 0 ? (

          <div className="campaign-table-panel">
            <div className="table-header">
              <h2 className="table-title">
                Campaigns {filteredCampaigns.length !== campaigns.length && `(${filteredCampaigns.length} of ${campaigns.length})`}
              </h2>
              <p className="table-subtitle">
                {usersLoading
                  ? 'Loading user data...'
                  : `Showing ${filteredCampaigns.length} campaign${filteredCampaigns.length !== 1 ? 's' : ''}`}
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