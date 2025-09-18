import { configureStore } from '@reduxjs/toolkit';
import campaignReducer, {
  addCampaign,
  addCampaigns,
  setLoading,
  setError,
} from '../campaignSlice';
import { Campaign } from '@/types/campaign.types';

const createTestStore = () => {
  return configureStore({
    reducer: {
      campaigns: campaignReducer,
    },
  });
};

describe('campaignSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should add a single campaign', () => {
    const newCampaign: Campaign = {
      id: 'test-1',
      name: 'Test Campaign',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 1000,
      userId: 1,
    };

    store.dispatch(addCampaign(newCampaign));
    
    const state = store.getState().campaigns;
    expect(state.campaigns).toHaveLength(11); // 10 initial + 1 new
    expect(state.campaigns).toContainEqual(newCampaign);
  });

  it('should add multiple campaigns', () => {
    const newCampaigns: Campaign[] = [
      {
        id: 'test-1',
        name: 'Test Campaign 1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        budget: 1000,
        userId: 1,
      },
      {
        id: 'test-2',
        name: 'Test Campaign 2',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        budget: 2000,
        userId: 2,
      },
    ];

    store.dispatch(addCampaigns(newCampaigns));
    
    const state = store.getState().campaigns;
    expect(state.campaigns).toHaveLength(12); // 10 initial + 2 new
    expect(state.campaigns).toEqual(expect.arrayContaining(newCampaigns));
  });

  it('should set loading state', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().campaigns.loading).toBe(true);

    store.dispatch(setLoading(false));
    expect(store.getState().campaigns.loading).toBe(false);
  });

  it('should set error state', () => {
    const errorMessage = 'Test error';
    store.dispatch(setError(errorMessage));
    expect(store.getState().campaigns.error).toBe(errorMessage);

    store.dispatch(setError(null));
    expect(store.getState().campaigns.error).toBeNull();
  });

  it('should have initial campaigns', () => {
    const state = store.getState().campaigns;
    expect(state.campaigns).toHaveLength(10);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});