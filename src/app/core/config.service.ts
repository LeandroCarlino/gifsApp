import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { Config } from './gif';

/**
 * La API key no vive en el repositorio: se lee en runtime desde
 * `config.json` (ignorado por git). En producción, el workflow lo genera
 * a partir de un secret de GitHub Actions.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  /**
   * Se agrega un parámetro único para que GitHub Pages (que cachea con
   * `max-age=600`) no entregue una config vieja después de rotar la key.
   * El archivo pesa 40 bytes: no vale la pena cachearlo.
   */
  private readonly url = `config.json?v=${Date.now()}`;
  private readonly recurso = httpResource<Config>(() => this.url);

  readonly apiKey = computed(() => this.recurso.value()?.giphyApiKey?.trim() ?? '');
  readonly cargando = this.recurso.isLoading;
  readonly faltaConfig = computed(
    () => !this.cargando() && this.recurso.error() !== undefined,
  );
}
