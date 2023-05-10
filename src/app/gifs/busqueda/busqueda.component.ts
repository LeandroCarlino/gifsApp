import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  tags: string[] = ['Anime', 'Lofi', 'Developer', 'Gaming', 'Tokyo'];
  constructor(private gifsService: GifsService) { }

  ngOnInit(): void {
    this.gifsService.buscarGifs('Tokyo')
  }

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
