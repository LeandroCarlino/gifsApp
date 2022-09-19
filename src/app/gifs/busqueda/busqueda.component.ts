import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent{
  
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  search () {
    const value = this.txtBuscar.nativeElement.value;
    console.log(value);
    this.txtBuscar.nativeElement.value = '';
  }

}
