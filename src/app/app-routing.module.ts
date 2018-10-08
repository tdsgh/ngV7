import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent }    from './not-found.component';
import { LoadingPageComponent }    from './loading-page.component';
import { StartPageComponent }    from './start/start-page.component';

//import { CanDeactivateGuard }       from './can-deactivate-guard.service';
//import { AuthGuard }                from './auth-guard.service';
//import { SelectivePreloadingStrategy } from './selective-preloading-strategy';

const appRoutes: Routes = [
    { path: 'loading', component: LoadingPageComponent },
    { path: 'start',   component: StartPageComponent },
  
    { path: '**', component: PageNotFoundComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, // <-- debugging purposes only
        //preloadingStrategy: SelectivePreloadingStrategy,
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    //SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }
