import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  purchase(purchaseFormData: any) {
    return this.http.post<any>('https://localhost:7172/api/userGame/purchase', purchaseFormData);
  }
}
