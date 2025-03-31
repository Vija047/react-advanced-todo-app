
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface WeatherData {
  temperature: number;
  conditions: string;
  icon: string;
  date: string;
}

interface WeatherState {
  data: Record<string, WeatherData>; // Map of date string to weather data
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null,
};

// Mock weather API call
const mockWeatherData = {
  '2023-06-12': { temperature: 22, conditions: 'Sunny', icon: 'sun', date: '2023-06-12' },
  '2023-06-13': { temperature: 20, conditions: 'Partly Cloudy', icon: 'cloud-sun', date: '2023-06-13' },
  '2023-06-14': { temperature: 18, conditions: 'Rainy', icon: 'cloud-rain', date: '2023-06-14' },
  '2023-06-15': { temperature: 17, conditions: 'Thunderstorm', icon: 'cloud-lightning', date: '2023-06-15' },
  '2023-06-16': { temperature: 21, conditions: 'Cloudy', icon: 'cloud', date: '2023-06-16' },
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (date: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get current date in YYYY-MM-DD format for mock data
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      // Generate random weather conditions if we don't have mock data for the date
      if (!mockWeatherData[date]) {
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
        const icons = ['sun', 'cloud-sun', 'cloud', 'cloud-rain', 'cloud-lightning'];
        const randomIndex = Math.floor(Math.random() * conditions.length);
        const randomTemp = Math.floor(Math.random() * 15) + 15; // Random temperature between 15-30°C
        
        return {
          date,
          temperature: randomTemp,
          conditions: conditions[randomIndex],
          icon: icons[randomIndex],
        };
      }
      
      return mockWeatherData[date];
    } catch (error) {
      return rejectWithValue('Failed to fetch weather data.');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.date] = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
