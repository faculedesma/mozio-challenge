type CityAPI = Array<string | number>;

interface ICityMapped {
  name: string;
  latitude: number;
  longitude: number;
}

interface ICityDistance {
  cityOne: string;
  cityTwo: string;
  distance: number;
}

export type { CityAPI, ICityMapped, ICityDistance };
