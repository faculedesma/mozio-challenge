import { EARTH_RADIUS } from '@/constants';

const degreesToRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

const haversineCalculation = (
  latitudeOne: number,
  lon1: number,
  latitudeTwo: number,
  lon2: number
): number => {
  const latitudeOneRad = degreesToRadians(latitudeOne);
  const longitudeOneRadian = degreesToRadians(lon1);
  const latitudeTwoRad = degreesToRadians(latitudeTwo);
  const longitudeTwoRadian = degreesToRadians(lon2);

  const latDiff = latitudeTwoRad - latitudeOneRad;
  const lonDiff = longitudeTwoRadian - longitudeOneRadian;

  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(latitudeOneRad) *
      Math.cos(latitudeTwoRad) *
      Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS * c;

  return parseFloat(distance.toFixed(2));
};

const parseDateFromURL = (date: string | null): Date => {
  let parsedDate;
  if (date) {
    const splittedDate = date.split('-');
    parsedDate = new Date(
      parseInt(splittedDate[2]),
      parseInt(splittedDate[0]) - 1,
      parseInt(splittedDate[1])
    );
  } else {
    parsedDate = new Date();
  }
  return parsedDate;
};

export { haversineCalculation, parseDateFromURL };
