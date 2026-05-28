export interface HotelOption {
  name: string;
  address?: string;
  placeId?: string;
  /** Name came from Google Places search. */
  googleVerified?: boolean;
}
