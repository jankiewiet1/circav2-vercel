import axios from 'axios';

// Load API key from environment variable - support both Vite and Next.js env formats
const CLIMATIQ_API_KEY = 
  // @ts-ignore - Next.js env
  (typeof process !== 'undefined' && process.env && process.env.VITE_CLIMATIQ_API_KEY) || 
  // @ts-ignore - Vite env
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLIMATIQ_API_KEY) || 
  '2EJNHK4KN957591GX5J7Q6ZR9M'; // Fallback to test key

const CLIMATIQ_API_URL = 'https://api.climatiq.io';

// Create a reusable Axios instance with the Climatiq API configuration
export const climatiqClient = axios.create({
  baseURL: CLIMATIQ_API_URL,
  headers: {
    'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip'
  }
});

// Handle API errors consistently
climatiqClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Climatiq API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for Climatiq API requests and responses
export interface ClimatiqEstimateParams {
  emission_factor: {
    activity_id: string;
    data_version?: string;
    region?: string;
  };
  parameters: Record<string, any>;
}

export interface ClimatiqResponse {
  co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  co2e_calculation_origin: string;
  emission_factor: {
    name: string;
    activity_id: string;
    id: string;
    access_type: string;
    source: string;
    source_dataset: string;
    year: number;
    region: string;
    category: string;
    source_lca_activity: string;
    data_quality_flags: string[];
  };
  constituent_gases: {
    co2e_total: number;
    co2e_other: number | null;
    co2: number | null;
    ch4: number | null;
    n2o: number | null;
  };
  activity_data: {
    activity_value: number;
    activity_unit: string;
  };
  audit_trail: string;
  notices: string[];
}

/**
 * Calculate emissions using Climatiq API
 */
export async function calculateEmissions(params: ClimatiqEstimateParams): Promise<ClimatiqResponse> {
  try {
    const response = await climatiqClient.post('/data/v1/estimate', params);
    return response.data;
  } catch (error: any) {
    console.error('Error calculating emissions with Climatiq:', error.response?.data || error.message);
    throw new Error(`Climatiq API error: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Search for emission factors by activity
 */
export async function searchEmissionFactors(query: string): Promise<any> {
  try {
    const response = await climatiqClient.get('/emission-factors', {
      params: { query }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error searching emission factors:', error.response?.data || error.message);
    throw new Error(`Climatiq API error: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Get emission factor details by ID
 */
export async function getEmissionFactor(id: string): Promise<any> {
  try {
    const response = await climatiqClient.get(`/emission-factors/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting emission factor:', error.response?.data || error.message);
    throw new Error(`Climatiq API error: ${error.response?.data?.error || error.message}`);
  }
} 