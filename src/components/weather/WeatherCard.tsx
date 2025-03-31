
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchWeather } from '@/store/slices/weatherSlice';
import { 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSun, 
  Sun, 
  LucideIcon 
} from 'lucide-react';

interface WeatherCardProps {
  date: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ date }) => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.weather);
  const weatherData = data[date];

  useEffect(() => {
    if (!weatherData && date) {
      dispatch(fetchWeather(date));
    }
  }, [dispatch, date, weatherData]);

  if (loading && !weatherData) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return null;
  }

  const getWeatherIcon = (): LucideIcon => {
    switch (weatherData.icon) {
      case 'cloud-rain':
        return CloudRain;
      case 'cloud-lightning':
        return CloudLightning;
      case 'cloud-sun':
        return CloudSun;
      case 'cloud':
        return Cloud;
      case 'sun':
      default:
        return Sun;
    }
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <WeatherIcon className="h-10 w-10 mr-4 text-primary" />
          <div>
            <h3 className="font-medium">{weatherData.temperature}°C</h3>
            <p className="text-sm text-muted-foreground">{weatherData.conditions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
