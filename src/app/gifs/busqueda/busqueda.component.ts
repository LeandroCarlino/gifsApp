import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent {
  tags: string[] = ['Anime', 'Lofi', 'Developer', 'Gaming', 'Tokyo'];
  constructor(private gifsService: GifsService) {}

  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  search() {
    const value = this.txtBuscar.nativeElement.value;
    this.gifsService.buscarGifs(value);
    this.txtBuscar.nativeElement.value = '';
  }

  searchForTag(query: string) {
    this.gifsService.buscarGifs(query);
  }
}
