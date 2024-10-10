import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage {
  recipesService = inject(RecipesService);
  router = inject(Router);

  recipesData = signal(this.recipesService.getRecipes());

  ionViewWillEnter() {
    this.recipesData.set(this.recipesService.getRecipes());
  }
}
