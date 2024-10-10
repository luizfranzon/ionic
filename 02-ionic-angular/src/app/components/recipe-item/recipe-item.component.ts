import { Component, input, OnInit } from '@angular/core';
import { RecipeModel } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent {
  recipeData = input.required<RecipeModel>();
}
