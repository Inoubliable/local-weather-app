import { ICurrentWeather } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }];
  main: {
    temp: number
  };
  sys: {
    country: string
  };
  dt: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements IWeatherService {

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather> {
    return this.http.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${environment.appId}`
    ).pipe(
      map(data => this.transformToICurrentWeather(data))
    );
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: data.main.temp,
      description: data.weather[0].description
    };
  }

}

export interface IWeatherService {
  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather>;
}
