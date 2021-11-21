import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  private refGlobalUrl = environment.apiRootUrl;

  private header = new HttpHeaders().set(
    "Authorization",
    `${localStorage.getItem(environment.userToken)}`
  );

  constructor(private http: HttpClient) { }

  public login(): Observable<any> {
    const URL = `${this.refGlobalUrl}/login`;
    const payload = { login: "letscode", senha: "lets@123" };
    return this.http.post<any>(URL, payload);
  }

  public getCards(): Observable<Card[]> {
    const URL = `${this.refGlobalUrl}/cards`;
    return this.http.get<Card[]>(URL, { headers: this.header });
  }

  public saveCard(card: Card): Observable<Card> {
    const URL = `${this.refGlobalUrl}/cards`;
    return this.http.post<Card>(URL, card, { headers: this.header });
  }

  public updateCard(card: Card): Observable<Card> {
    const URL = `${this.refGlobalUrl}/cards/${card.id}`;
    return this.http.put<Card>(URL, card, { headers: this.header });
  }

  public deleteCard(id: string): Observable<Card> {
    const URL = `${this.refGlobalUrl}/cards/${id}`;
    return this.http.delete<Card>(URL, { headers: this.header });
  }
}
