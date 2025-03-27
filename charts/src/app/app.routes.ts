import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'chart/:stock_id',
        loadComponent: () => import('./screens/chart/chart.component').then((m) => m.ChartComponent),
    }
];
