import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Gif, GiphyRespuesta, LIMITE } from './gif';
import { ConfigService } from './config.service';

const CLAVE_HISTORIAL = 'gifsapp.historial.v2';
const CLAVE_RESULTADOS = 'gifsapp.resultados.v2';
const MAX_HISTORIAL = 8;

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* almacenamiento lleno o bloqueado: no es crítico */
  }
}

@Injectable({ providedIn: 'root' })
export class GifsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  private readonly _historial = signal<string[]>(
    leer<string[]>(CLAVE_HISTORIAL, []),
  );
  private readonly _resultados = signal<Gif[]>(
    leer<Gif[]>(CLAVE_RESULTADOS, []),
  );
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _ultima = signal('');

  readonly historial = this._historial.asReadonly();
  readonly resultados = this._resultados.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly ultima = this._ultima.asReadonly();
  readonly hayResultados = computed(() => this._resultados().length > 0);

  buscar(consulta: string): void {
    const termino = consulta.trim();
    if (!termino) return;

    const apiKey = this.config.apiKey();
    if (!apiKey) {
      this._error.set(
        'Falta la API key de Giphy. Copiá config.example.json a config.json y pegá la tuya.',
      );
      return;
    }

    this._cargando.set(true);
    this._error.set(null);
    this._ultima.set(termino);

    this.http
      .get<GiphyRespuesta>('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: apiKey,
          q: termino,
          limit: LIMITE,
          rating: 'g',
          lang: 'es',
        },
      })
      .subscribe({
        next: (respuesta) => {
          this._resultados.set(respuesta.data);
          this._cargando.set(false);
          this.registrarEnHistorial(termino);
          guardar(CLAVE_RESULTADOS, respuesta.data);
        },
        error: () => {
          this._cargando.set(false);
          this._error.set(
            'No pudimos buscar GIFs. Revisá la conexión o la API key e intentá de nuevo.',
          );
        },
      });
  }

  limpiarHistorial(): void {
    this._historial.set([]);
    guardar(CLAVE_HISTORIAL, []);
  }

  private registrarEnHistorial(termino: string): void {
    const normalizado = termino.toLowerCase();
    const historial = this._historial().filter(
      (item) => item.toLowerCase() !== normalizado,
    );
    historial.unshift(termino);
    const recortado = historial.slice(0, MAX_HISTORIAL);
    this._historial.set(recortado);
    guardar(CLAVE_HISTORIAL, recortado);
  }
}
