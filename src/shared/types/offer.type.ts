import { User } from './user.type.js';
import { City } from './cities-type.enum.js';

export type Location = {
  latitude: number;
  longitude: number;
}

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  guests: number;
  price: number;
  goods: string[];
  user: User;
  location: Location;
}
