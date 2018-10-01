import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.components';

//import Home
import { HomeComponent }      from './components/home.component';

const appRoutes: Routes = [
    /*{
        path:'',
        redirectTo: '/artists/1',
        pathMatch: 'full'
    }, //nos regirige ruta por defecto (Home) a Artists*/
    {path: '', component: HomeComponent}, //ruta por defecto
    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component: HomeComponent} //cuando no exista nada
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);