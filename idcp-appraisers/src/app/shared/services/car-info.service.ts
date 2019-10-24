import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const carBrands = [
  { brand: 'Chevrolet', models: [{model: 'Bolt'}, {model: 'Camaro'}, {model: 'Colorado'}, {model: 'Corvette'}, {model: 'Cruze'}] },
  { brand: 'Audi', models: [{model: 'A3'}, {model: 'A4'}, {model: 'S4'}, {model: 'A5'}]},
  { brand: 'Nissan', models: [{model: 'Altima'}, {model: 'Armada'}, {model: '370Z'}, {model: 'Frontier'}]},
  { brand: 'Ford', models: [{model: 'Arteon'}, {model: 'Atlas'}, {model: 'Altima'}, {model: 'e-Golf'}, {model: 'Golf'}] },
];

@Injectable({
  providedIn: 'root'
})
export class CarInfoService {

  constructor() { }

  public getBrands(): Observable<any[]> {
    return of(carBrands);
  }

  public getModelsByBrand(brand: string): Observable<any[]> {
    let result = [];
    if (brand) {
      const brandObj = carBrands.find(b => b.brand === brand);
      if (brandObj) {
        result = brandObj.models;
      }
    }
    return of(result);
  }
}
