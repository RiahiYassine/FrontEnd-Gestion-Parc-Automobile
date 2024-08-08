import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8020/alertes';

  constructor(private http: HttpClient) { }

  // Get alerts that need notifications (e.g., one day before the reminder date)
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`);
  }

  // Trigger notifications manually (if needed)
  triggerNotifications(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/trigger-notifications`, {});
  }

}
