import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialCampaigns = {
  campaigns: [
    {
      id: "1",
      name: "Divavu",
      startDate: "9/19/2021",
      endDate: "3/9/2023",
      budget: 88377,
      userId: 3,
    },
    {
      id: "2",
      name: "Jaxspan",
      startDate: "11/21/2023",
      endDate: "2/21/2024",
      budget: 608715,
      userId: 6,
    },
    {
      id: "3",
      name: "Miboo",
      startDate: "11/1/2022",
      endDate: "6/20/2022",
      budget: 239507,
      userId: 7,
    },
    {
      id: "4",
      name: "Trilith",
      startDate: "8/25/2022",
      endDate: "11/30/2022",
      budget: 179838,
      userId: 1,
    },
    {
      id: "5",
      name: "Layo",
      startDate: "11/28/2017",
      endDate: "3/10/2023",
      budget: 837850,
      userId: 9,
    },
    {
      id: "6",
      name: "Photojam",
      startDate: "7/25/2019",
      endDate: "6/23/2021",
      budget: 858131,
      userId: 3,
    },
    {
      id: "7",
      name: "Blogtag",
      startDate: "6/27/2019",
      endDate: "1/15/2021",
      budget: 109078,
      userId: 2,
    },
    {
      id: "8",
      name: "Rhyzio",
      startDate: "10/13/2020",
      endDate: "1/25/2022",
      budget: 272552,
      userId: 4,
    },
    {
      id: "9",
      name: "Zoomcast",
      startDate: "9/6/2021",
      endDate: "11/10/2023",
      budget: 301919,
      userId: 8,
    },
    {
      id: "10",
      name: "Realbridge",
      startDate: "3/5/2021",
      endDate: "10/2/2026",
      budget: 505602,
      userId: 5,
    },
  ],
  loading: false,
  error: null,
};

export type Campaign = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  userId: number;
};

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: initialCampaigns.campaigns,
  loading: initialCampaigns.loading,
  error: initialCampaigns.error,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
    addCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns.push(...action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addCampaign, addCampaigns, setLoading, setError } =
  campaignSlice.actions;
export default campaignSlice.reducer;
