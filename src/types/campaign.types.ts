export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  userId: number;
}

export interface CampaignWithStatus extends Campaign {
  isActive: boolean;
  userName: string;
}

export interface CampaignFormData {
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  userId: number;
}