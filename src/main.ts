import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {  HttpBackend, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

//ionic storage
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

//Multi Language
import {TranslateModule , TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { jwtInterceptor } from './app/services/Auth-functions/JwtInterceptor';
import { errorInterceptor } from './app/services/Auth-functions/ErrorInterceptor';



export function HttpLoaderFactory(httpHandler: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(httpHandler),'./assets/i18n/','.json');
}

defineCustomElements(window);

const ionicRouteProvider = { provide: RouteReuseStrategy, useClass: IonicRouteStrategy };

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [ ionicRouteProvider ,
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory ,
        deps: [HttpBackend]
      }
    })),
    importProvidersFrom(IonicStorageModule.forRoot({
      name:'storagedb',
      driverOrder:[Drivers.IndexedDB]
    })),
    provideHttpClient(withInterceptors([jwtInterceptor,errorInterceptor]))
  ],
});
