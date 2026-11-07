import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Gif, TAGS } from '../../core/gif';
import { GifsService } from '../../core/gifs.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  /** Viene del query param `?q=` (component input binding). */
  readonly q = input<string>();

  protected readonly gifs = inject(GifsService);
  private readonly router = inject(Router);

  protected readonly tags = TAGS;
  protected readonly termino = signal('');
  protected readonly indice = signal<number | null>(null);

  private readonly visor = viewChild.required<ElementRef<HTMLDialogElement>>('visor');

  protected readonly gifActivo = computed<Gif | null>(() => {
    const i = this.indice();
    return i === null ? null : (this.gifs.resultados()[i] ?? null);
  });

  constructor() {
    effect(() => {
      const consulta = this.q()?.trim();
      if (consulta) {
        this.termino.set(consulta);
        this.gifs.buscar(consulta);
      }
    });
  }

  protected valorDe(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }

  protected buscar(consulta: string): void {
    const termino = consulta.trim();
    if (!termino) return;

    this.termino.set(termino);

    const actual = (this.q() ?? '').toLowerCase();
    if (termino.toLowerCase() === actual) {
      this.gifs.buscar(termino);
      return;
    }

    this.router.navigate(['/'], { queryParams: { q: termino } });
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.buscar(this.termino());
  }

  protected abrir(indice: number): void {
    this.indice.set(indice);
    this.visor().nativeElement.showModal();
  }

  protected cerrar(): void {
    this.visor().nativeElement.close();
    this.indice.set(null);
  }

  protected mover(delta: number): void {
    const total = this.gifs.resultados().length;
    if (!total) return;
    const actual = this.indice() ?? 0;
    this.indice.set((actual + delta + total) % total);
  }

  protected alPresionar(evento: KeyboardEvent): void {
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      this.mover(-1);
    }
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      this.mover(1);
    }
  }

  protected alClicFondo(evento: MouseEvent): void {
    if (evento.target === this.visor().nativeElement) this.cerrar();
  }

  protected limpiarHistorial(): void {
    this.gifs.limpiarHistorial();
  }
}
