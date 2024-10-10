import { Injectable } from '@angular/core';
import { RecipeModel } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipes: RecipeModel[] = [
    {
      id: 'r1',
      title: 'Spaghetti Carbonara',
      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1001491_11-2e0fa5c.jpg?quality=90&resize=440,400',
      ingredients: ['Spaghetti', 'Bacon', 'Eggs', 'Parmesan', 'Pepper'],
    },
    {
      id: 'r2',
      title: 'Pancakes',
      imageUrl:
        'https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg',
      ingredients: ['Flour', 'Milk', 'Eggs', 'Sugar', 'Baking Powder', 'Honey'],
    },
  ];

  getRecipes() {
    return [...this.recipes];
  }

  getRecipeById(recipeId: string) {
    return {
      ...this.recipes.find((recipe) => {
        return recipe.id === recipeId;
      }),
    };
  }

  deleteRecipeById(recipeId: string) {
    this.recipes = this.recipes.filter((recipe) => {
      return recipe.id !== recipeId;
    });
  }
}
