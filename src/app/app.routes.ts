import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'GIFS App — buscador de GIFs',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
  },
  { path: '**', redirectTo: '' },
];
