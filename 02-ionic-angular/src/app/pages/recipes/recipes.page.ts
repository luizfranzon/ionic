import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipesService = inject(RecipesService);
  router = inject(Router);

  recipesData = signal(this.recipesService.getRecipes());

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.recipesData.set(this.recipesService.getRecipes());
    });
  }
}
