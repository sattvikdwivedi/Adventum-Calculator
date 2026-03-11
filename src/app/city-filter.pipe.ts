import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cityFilter' })
export class CityFilterPipe implements PipeTransform {
  transform(city: string, query: string): boolean {
    if (!query || !query.trim()) return true;
    return city.toLowerCase().includes(query.trim().toLowerCase());
  }
}
