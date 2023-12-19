import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteCharactersService {
  private favoriteCharactersSubject = new BehaviorSubject<string[]>([]);
  favoriteCharacters$: Observable<string[]> = this.favoriteCharactersSubject.asObservable();

  addToFavorites(characterName: string): void {
    const currentFavorites = this.favoriteCharactersSubject.value;
    this.favoriteCharactersSubject.next([...currentFavorites, characterName]);
  }

  removeFromFavorites(characterName: string): void {
    const currentFavorites = this.favoriteCharactersSubject.value;
    const updatedFavorites = currentFavorites.filter((name) => name !== characterName);
    this.favoriteCharactersSubject.next(updatedFavorites);
  }

  removeAllFavorites(): void {
    this.favoriteCharactersSubject.next([]);
  }
}
