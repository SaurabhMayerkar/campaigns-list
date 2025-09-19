import { useState } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppDispatch } from '@/store/hooks';
import { CampaignFormData } from '@/types/campaign.types';
import { addCampaign } from '@/store/slices/campaignSlice';
import './AddCampaignPopup.css';

// Form validation schema using Zod for robust type-safe validation
const formSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  budget: z.number().min(1, 'Budget must be greater than 0'),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

interface AddCampaignPopupProps {
  open: boolean;
  onClose: () => void;
}

/**
 * AddCampaignPopup Component
 * A modal dialog for creating new marketing campaigns with form validation
 * Features real-time validation, date range constraints, and success feedback
 */
export const AddCampaignPopup = ({ open, onClose }: AddCampaignPopupProps) => {
  const dispatch = useAppDispatch();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(formSchema),  // Integrate Zod validation
    defaultValues: {
      name: '',
      budget: 0,
      userId: undefined,
    },
  });

   /**
   * Handles form submission with validated data
   * Creates a new campaign object and dispatches to Redux store
   * Shows success message and resets form on successful submission
   */
  const onSubmit = (data: CampaignFormData) => {
    const newCampaign = {
      id: null,
      name: data.name,
      startDate: format(data.startDate, 'MM/dd/yyyy'),
      endDate: format(data.endDate, 'MM/dd/yyyy'),
      budget: data.budget,
      userId: data.userId,
    };

    // Dispatch the action to add campaign to Redux store
    dispatch(addCampaign(newCampaign));

    setSubmitSuccess(true);
    reset();

    // Hide success message after 2 seconds and close popup
    setTimeout(() => {
      setSubmitSuccess(false);
      onClose();
    }, 2000);

  };

  /**
   * Handles dialog close with form reset
   * Ensures form is cleared when modal is closed
   */
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="dialog-header">
          Add New Campaign
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="add-campaign-form-container">
            {submitSuccess && (
              <div className="success-alert">
                Campaign has been successfully added!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="campaign-form">
              <div className="form-grid">
                <div className="form-row">
                  <div className="form-field">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <div className="input-group">
                          <label htmlFor="campaign-name">Campaign Name</label>
                          <input
                            {...field}
                            id="campaign-name"
                            type="text"
                            placeholder="Enter campaign name"
                            className={errors.name ? 'error' : ''}
                          />
                          {errors.name && (
                            <span className="error-text">{errors.name.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="form-field">
                    <Controller
                      name="budget"
                      control={control}
                      render={({ field }) => (
                        <div className="input-group">
                          <label htmlFor="campaign-budget">Budget (USD)</label>
                          <input
                            {...field}
                            id="campaign-budget"
                            type="number"
                            placeholder="Enter budget"
                            className={errors.budget ? 'error' : ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          {errors.budget && (
                            <span className="error-text">{errors.budget.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <div className="input-group">
                          <label>Start Date</label>
                          <DatePicker
                            {...field}
                            maxDate={control._formValues.endDate || undefined}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.startDate,
                                helperText: errors.startDate?.message,
                                className: "date-picker-input"
                              }
                            }}
                          />
                          {errors.startDate && (
                            <span className="error-text">{errors.startDate.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="form-field">
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <div className="input-group">
                          <label>End Date</label>
                          <DatePicker
                            {...field}
                            minDate={control._formValues.startDate || undefined}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.endDate,
                                helperText: errors.endDate?.message,
                                className: "date-picker-input"
                              }
                            }}
                          />
                          {errors.endDate && (
                            <span className="error-text">{errors.endDate.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          Add Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};