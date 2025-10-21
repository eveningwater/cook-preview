import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipe/:category/:recipe', component: RecipeDetailComponent },
  { path: '**', redirectTo: '' }
];
