import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RetailPricing {
  pricingId: number;
  storeId: string;
  sku: string;
  productName: string;
  price: number;
  priceDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class RetailPricingService {

  private apiUrl = 'http://localhost:5185/api/RetailPricing';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RetailPricing[]> {
    return this.http.get<RetailPricing[]>(this.apiUrl);
  }

  update(id: number, pricing: RetailPricing): Observable<RetailPricing> {
  return this.http.put<RetailPricing>(`${this.apiUrl}/${id}`, pricing);
}

search(storeId?: string,sku?: string, productName?: string): Observable<RetailPricing[]> {

  let url = `${this.apiUrl}/search`;

  const params: string[] = [];

  if (storeId) {
    params.push(`storeId=${encodeURIComponent(storeId)}`);
  }

  if (sku) {
    params.push(`sku=${encodeURIComponent(sku)}`);
  }

  if (productName) {
    params.push(`productName=${encodeURIComponent(productName)}`);
  }

  if (params.length > 0) {
    url += '?' + params.join('&');
  }

  return this.http.get<RetailPricing[]>(url);
}
uploadCsv(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
}
}