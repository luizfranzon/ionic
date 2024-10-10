import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RecipeModel } from 'src/app/models/recipe.model';
import { RecipesService } from 'src/app/services/recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  router = inject(Router);
  alertCtrl = inject(AlertController);
  recipeService = inject(RecipesService);
  activatedRoute = inject(ActivatedRoute);

  recipeData = signal<RecipeModel | null>(null);

  handleDeleteRecipe() {
    this.alertCtrl
      .create({
        header: 'Are you sure?',
        message: 'Do you really want to delete the recipe?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.deleteRecipe();
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  deleteRecipe() {
    this.recipeService.deleteRecipeById(this.recipeData()?.id!);
    this.router.navigate(['/recipes']);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const recipeParamName = 'recipeId';

      if (!param.has(recipeParamName)) {
        this.router.navigate(['/recipes']);
        return;
      }
      const recipeId = param.get(recipeParamName);
      const recipe = this.recipeService.getRecipeById(recipeId!) as RecipeModel;
      this.recipeData.set(recipe);
    });
  }
}
