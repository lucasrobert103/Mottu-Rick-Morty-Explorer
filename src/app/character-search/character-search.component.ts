import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { FavoriteCharactersService } from '../../services/favorite-characters.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-character-search',
  templateUrl: './character-search.component.html',
  styleUrls: ['./character-search.component.scss'],
})
export class CharacterSearchComponent implements OnInit {
  characterName = new FormControl('');
  characterInfo: any;
  displayedCharacters: any[] = [];
  pageSize = 5;
  notFoundMessage = '';
  showFavorites = false;
  showAllFavoritesFlag = false;
  favoriteCharacters$: Observable<string[]>;

  constructor(
    private characterService: CharacterService,
    private favoriteCharactersService: FavoriteCharactersService
  ) {
    this.favoriteCharacters$ = this.favoriteCharactersService.favoriteCharacters$;
  }

  ngOnInit(): void {
    this.searchRandomCharacter();
    this.characterName.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((name): name is string => !!name)
      )
      .subscribe();
  }

  addToFavorites(characterName: string): void {
    this.favoriteCharactersService.addToFavorites(characterName);
  }

  removeFavorite(characterName: string): void {
    this.favoriteCharactersService.removeFromFavorites(characterName);
  }

  removeAllFavorites(): void {
    this.favoriteCharactersService.removeAllFavorites();
  }

  searchCharacters(): void {
    const name = this.characterName.value;
    if (name) {
      this.characterService.getCharacterByName(name).subscribe(
        (data) => {
          this.characterInfo = data?.results;
          this.displayedCharacters = this.characterInfo.slice(0, this.pageSize);
          this.notFoundMessage = this.characterInfo.length === 0 ? 'Character not found.' : '';
        },
        (error) => {
          console.error(error);
          this.notFoundMessage = 'Esse personagem não existe';
        }
      );
    } else {
      this.characterInfo = [];
      this.displayedCharacters = [];
      this.notFoundMessage = 'Por favor insira um nome de personagem.';
    }
  }

  pageChanged(event: any): void {
    const startIndex = event.pageIndex * this.pageSize;
    this.displayedCharacters = this.characterInfo.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFavoritesView(): void {
    this.showFavorites = !this.showFavorites;
  }

  showAllFavorites(): void {
    this.showAllFavoritesFlag = true;
  }

  searchRandomCharacter(): void {
    this.characterService.getRandomCharacter().subscribe(
      (randomCharacter) => {
        this.displayedCharacters = [randomCharacter];
        this.notFoundMessage = '';
      },
      (error) => {
        console.error(error);
        this.notFoundMessage = 'Error fetching random character.';
      }
    );
  }

  downloadImage(imageUrl: string): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'character_image.jpg';
    link.click();
  }
}
