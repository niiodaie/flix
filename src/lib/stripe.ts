import { fetchFromApi } from "@/lib/api";

export interface TipRequest {
  fromUser: string;
  toUser: string;
  videoId?: string;
  amountCents: number;
  currency?: string;
}

export interface TipResponse {
  success: boolean;
  tip: any;
  message: string;
  error?: string;
}

export const sendTip = async (tipData: TipRequest): Promise<TipResponse> => {
  try {
    const response = await fetchFromApi("/tips", { 
      method: "POST", 
      body: JSON.stringify(tipData) 
    });
    return response;
  } catch (error) {
    console.error('Error sending tip:', error);
    throw error;
  }
};

export const getTips = async (userId: string, type?: 'sent' | 'received', limit = 20, offset = 0) => {
  const params = new URLSearchParams({
    userId,
    limit: limit.toString(),
    offset: offset.toString()
  });
  
  if (type) {
    params.append('type', type);
  }

  return fetchFromApi(`/tips?${params.toString()}`);
};

export const getDashboardEarnings = async (creatorId: string) => {
  return fetchFromApi(`/creator/dashboard?creatorId=${creatorId}`);
};

// Utility functions for tip amounts
export const formatTipAmount = (amountCents: number, currency = 'USD'): string => {
  const amount = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const validateTipAmount = (amountCents: number): { valid: boolean; error?: string } => {
  if (amountCents < 50) {
    return { valid: false, error: 'Minimum tip amount is $0.50' };
  }
  if (amountCents > 100000) { // $1000 max
    return { valid: false, error: 'Maximum tip amount is $1000' };
  }
  return { valid: true };
};

// Predefined tip amounts in cents
export const SUGGESTED_TIP_AMOUNTS = [
  { label: '$1', value: 100 },
  { label: '$5', value: 500 },
  { label: '$10', value: 1000 },
  { label: '$25', value: 2500 },
  { label: '$50', value: 5000 },
  { label: '$100', value: 10000 }
];


