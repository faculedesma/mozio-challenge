import type {
  CityAPI,
  ICityDistance,
  ICityMapped
} from '@/types/city';
import { haversineCalculation } from '@/utils';
import citiesJson from '@/data/cities.json';

class TravelAPI {
  getCityInformation(name: string): ICityMapped {
    const cityData = citiesJson.find(
      (city) => city[0] === name
    )!;
    return {
      name: cityData[0] as string,
      latitude: cityData[1] as number,
      longitude: cityData[2] as number
    };
  }

  getCitiesBySearchValue(
    value: string
  ): Promise<(string | number)[]> {
    const cities: CityAPI[] = citiesJson;
    const filteredCities = cities.filter((city) => {
      const cityName = city[0] as string;
      return cityName
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return Promise.resolve(
      filteredCities.length
        ? filteredCities.map((city) => city[0])
        : []
    );
  }

  getDistanceBetweenCities(
    cities: string[]
  ): Promise<ICityDistance[]> {
    const distances = [];

    for (let i = 0; i < cities.length - 1; i++) {
      const cityOne = this.getCityInformation(cities[i]);
      const cityTwo = this.getCityInformation(
        cities[i + 1]
      );

      const distance = haversineCalculation(
        cityOne.latitude,
        cityOne.longitude,
        cityTwo.latitude,
        cityTwo.longitude
      );

      distances.push({
        cityOne: cityOne.name,
        cityTwo: cityTwo.name,
        distance: distance
      });
    }

    return Promise.resolve(distances);
  }
}

export const travelAPI = new TravelAPI();
