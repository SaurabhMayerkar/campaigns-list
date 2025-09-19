import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './SearchFilters.css';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { AddCampaignPopup } from '../AddCampaignPopup/AddCampaignPopup';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  startDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  endDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
  onClearFilters: () => void;
}

/**
 * SearchFilters Component
 * Provides search and filtering controls for the campaigns dashboard
 * Includes text search, date range filtering, and campaign creation functionality
 */
export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
}: SearchFiltersProps) => {
  const hasFilters = searchTerm || startDate || endDate;

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);


  /**
   * Opens the Add Campaign popup dialog
  */
  const handleOpenAddPopup = () => {
    setIsAddPopupOpen(true);
  };

  /**
   * Closes the Add Campaign popup dialog
   */
  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="search-filters-container">
        <div className="search-filters-header">
          <div className="filters-header">
            <h2 className="filters-title">
              <span className="search-icon">🔍</span>
              Search & Filter Campaigns
            </h2>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddPopup}
              className="add-campaign-button"
            >
              Add Campaign
            </Button>
          </div>
        </div>

        <div className="search-filters-grid">
          <div className="filter-item search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={onStartDateChange}
              maxDate={endDate || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  className: 'date-picker'
                }
              }}
            />
          </div>

          <div className="filter-item">
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={onEndDateChange}
              minDate={startDate || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  className: 'date-picker'
                }
              }}
            />
          </div>

          <div className="filter-item clear-button-container">
            <button
              className={`clear-filters-button ${!hasFilters ? 'disabled' : ''}`}
              onClick={onClearFilters}
              disabled={!hasFilters}
            >
              <span className="clear-icon">✕</span>
              Clear
            </button>
          </div>
        </div>
      </div>

      <AddCampaignPopup
        open={isAddPopupOpen}
        onClose={handleCloseAddPopup}
      />

    </LocalizationProvider>
  );
};