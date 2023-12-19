// character.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacterByName(name: string): Observable<any> {
    const url = `${this.apiUrl}/?name=${name}`;
    return this.http.get(url);
  }

  getRandomCharacter(): Observable<any> {
    const url = `${this.apiUrl}/${Math.floor(Math.random() * 671) + 1}`;
    return this.http.get(url);
  }
}
