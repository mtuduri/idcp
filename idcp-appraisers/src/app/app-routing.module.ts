import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/wiki', pathMatch: 'full'},
  { path: 'wiki',  loadChildren: () => import('./modules/wiki/wiki.module').then(mod => mod.WikiModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
