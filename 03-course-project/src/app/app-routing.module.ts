import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./screens/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'places',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('./screens/places/places.module').then((m) => m.PlacesPageModule),
  },
  {
    path: 'bookings',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('./screens/bookings/bookings.module').then(
        (m) => m.BookingsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
