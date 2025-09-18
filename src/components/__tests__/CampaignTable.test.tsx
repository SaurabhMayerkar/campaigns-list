import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CampaignTable } from '../CampaignTable/CampaignTable';
import campaignReducer from '@/store/slices/campaignSlice';
import userReducer from '@/store/slices/userSlice';

const mockCampaigns = [
  {
    id: '1',
    name: 'Test Campaign 1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 5000,
    userId: 1,
  },
  {
    id: '2',
    name: 'Test Campaign 2',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    budget: 3000,
    userId: 2,
  },
];

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '123-456-7890',
    website: 'johndoe.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Phrase',
      bs: 'Test BS',
    },
  },
];

const createTestStore = (users = mockUsers) => {
  return configureStore({
    reducer: {
      campaigns: campaignReducer,
      users: userReducer,
    },
    preloadedState: {
      campaigns: {
        campaigns: [],
        loading: false,
        error: null,
      },
      users: {
        users,
        loading: false,
        error: null,
      },
    },
  });
};

const renderWithStore = (component: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('CampaignTable', () => {
  it('renders campaign data correctly', () => {
    const { getByText } = renderWithStore(<CampaignTable campaigns={mockCampaigns} />);
    
    expect(getByText('Test Campaign 1')).toBeInTheDocument();
    expect(getByText('Test Campaign 2')).toBeInTheDocument();
    expect(getByText('$5,000.00')).toBeInTheDocument();
    expect(getByText('$3,000.00')).toBeInTheDocument();
  });

  it('shows campaign status correctly', () => {
    const { getByText } = renderWithStore(<CampaignTable campaigns={mockCampaigns} />);
  });

  it('displays user names correctly', () => {
    const { getByText } = renderWithStore(<CampaignTable campaigns={mockCampaigns} />);
    
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Unknown User')).toBeInTheDocument();
  });

  it('shows empty state when no campaigns', () => {
    const { getByText } = renderWithStore(<CampaignTable campaigns={[]} />);
    
    expect(getByText('No campaigns found matching your criteria.')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const { getByText } = renderWithStore(<CampaignTable campaigns={mockCampaigns} />);
    
    expect(getByText('Jan 1, 2024')).toBeInTheDocument();
    expect(getByText('Dec 31, 2024')).toBeInTheDocument();
  });
});