import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { GifsService } from './gifs.service';
import { ConfigService } from './config.service';
import { Gif } from './gif';

const gif: Gif = {
  id: 'abc',
  title: 'Gato',
  url: 'https://giphy.com/gifs/abc',
  images: {
    fixed_width: { url: 'https://media.giphy.com/abc/200w.gif', width: '200', height: '150' },
    downsized_medium: { url: 'https://media.giphy.com/abc/giphy.gif', width: '480', height: '360' },
    original: { url: 'https://media.giphy.com/abc/giphy.gif', width: '480', height: '360' },
  },
};

describe('GifsService', () => {
  let servicio: GifsService;
  let http: HttpTestingController;
  const apiKey = signal('clave-de-prueba');

  beforeEach(() => {
    localStorage.clear();
    apiKey.set('clave-de-prueba');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ConfigService,
          useValue: {
            apiKey,
            cargando: signal(false),
            faltaConfig: signal(false),
          },
        },
      ],
    });

    servicio = TestBed.inject(GifsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('no consulta la API si falta la key', () => {
    apiKey.set('');
    servicio.buscar('gatos');

    http.expectNone(() => true);
    expect(servicio.error()).toContain('API key');
  });

  it('envía la consulta con la key y el límite', () => {
    servicio.buscar('  Gatos  ');

    const req = http.expectOne((r) => r.url.endsWith('/gifs/search'));
    expect(req.request.params.get('api_key')).toBe('clave-de-prueba');
    expect(req.request.params.get('q')).toBe('Gatos');
    expect(req.request.params.get('limit')).toBe('24');

    req.flush({ data: [gif], pagination: { total_count: 1, count: 1, offset: 0 } });

    expect(servicio.resultados().length).toBe(1);
    expect(servicio.cargando()).toBe(false);
    expect(servicio.ultima()).toBe('Gatos');
  });

  it('guarda el historial sin repetir y en orden', () => {
    ['gatos', 'perros', 'GATOS'].forEach((termino) => {
      servicio.buscar(termino);
      http
        .expectOne((r) => r.url.endsWith('/gifs/search'))
        .flush({ data: [], pagination: { total_count: 0, count: 0, offset: 0 } });
    });

    expect(servicio.historial()).toEqual(['GATOS', 'perros']);
  });

  it('recorta el historial a ocho entradas', () => {
    for (let i = 0; i < 10; i++) {
      servicio.buscar(`termino-${i}`);
      http
        .expectOne((r) => r.url.endsWith('/gifs/search'))
        .flush({ data: [], pagination: { total_count: 0, count: 0, offset: 0 } });
    }

    expect(servicio.historial().length).toBe(8);
    expect(servicio.historial()[0]).toBe('termino-9');
  });

  it('muestra un error si la API falla', () => {
    servicio.buscar('gatos');

    http
      .expectOne((r) => r.url.endsWith('/gifs/search'))
      .flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(servicio.error()).toContain('No pudimos buscar');
    expect(servicio.cargando()).toBe(false);
  });

  it('limpia el historial', () => {
    servicio.buscar('gatos');
    http
      .expectOne((r) => r.url.endsWith('/gifs/search'))
      .flush({ data: [], pagination: { total_count: 0, count: 0, offset: 0 } });

    servicio.limpiarHistorial();

    expect(servicio.historial()).toEqual([]);
  });
});
