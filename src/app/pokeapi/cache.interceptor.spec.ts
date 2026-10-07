import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { cacheInterceptor } from './cache.interceptor';

describe('cacheInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([cacheInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('o segundo GET da mesma URL sai do cache, sem ir à rede', async () => {
    const primeiro = firstValueFrom(http.get('/pokemon/pikachu'));
    backend.expectOne('/pokemon/pikachu').flush({ id: 25 });
    expect(await primeiro).toEqual({ id: 25 });
    expect(await firstValueFrom(http.get('/pokemon/pikachu'))).toEqual({ id: 25 });
  });

  it('a query string faz parte da chave do cache', async () => {
    const semFiltro = firstValueFrom(http.get('/pokedex/'));
    backend.expectOne('/pokedex/').flush({ results: [] });
    await semFiltro;
    const comFiltro = firstValueFrom(http.get('/pokedex/', { params: { limit: 100 } }));
    backend.expectOne('/pokedex/?limit=100').flush({ results: [1] });
    expect(await comFiltro).toEqual({ results: [1] });
  });

  it('só GET é guardado', async () => {
    for (let i = 0; i < 2; i++) {
      const envio = firstValueFrom(http.post('/favoritos', {}));
      backend.expectOne('/favoritos').flush({});
      await envio;
    }
  });
});
