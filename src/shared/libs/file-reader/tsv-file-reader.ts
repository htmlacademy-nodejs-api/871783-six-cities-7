import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { User, City, Offer, Good } from "../../types/index.js";
import { Location } from "../../types/offer.type.js";

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error(`File was not read`);
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => TSVFileReader.parseLineToOffer(line));
  }

  private static parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      city,
      type,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      bedrooms,
      guests,
      price,
      goods,
      name,
      email,
      avatarUrl,
      password,
      isPro,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      title,
      description,
      date: new Date(date),
      city: city as City,
      type,
      previewImage,
      images: TSVFileReader.parseImages(images),
      isFavorite: TSVFileReader.parseBoolean(isFavorite),
      isPremium: TSVFileReader.parseBoolean(isPremium),
      rating: parseFloat(rating),
      bedrooms: parseInt(bedrooms, 10),
      guests: parseInt(guests, 10),
      price: parseInt(price, 10),
      goods: TSVFileReader.parseGoods(goods),
      user: TSVFileReader.parseUser(name, email, avatarUrl, password, isPro),
      location: TSVFileReader.parseLocation(latitude, longitude)
    };
  }

  private static parseImages(imagesString: string): string[] {
    return imagesString.split(';');
  }

  private static parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private static parseGoods(goodsString: string): Good[] {
    return goodsString.split(';') as Good[];
  }

  private static parseUser(password: string, avatarUrl: string | null, name: string, email: string, isPro: string): User {
    return {
      name,
      email,
      password,
      isPro: this.parseBoolean(isPro),
      avatarUrl: avatarUrl ?? null
    };
  }

  private static parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
