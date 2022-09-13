import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CacheInterceptorInterceptor } from './interceptors/cache-interceptor.interceptor';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonService } from './service/pokemon.service';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonCardComponent,
    SearchFilterPipe,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptorInterceptor,
      multi: true,
    },
    PokemonService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
