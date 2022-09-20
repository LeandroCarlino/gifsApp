import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'exOIIjOHpokVPgq2M25NWgNSSNRmJOG0';
  private _historial: string[] = [];
  public resultados: any[] = [];

  constructor(private http: HttpClient){}

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (query.trim().length != 0 && !this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
    }
    console.log(this._historial);

    this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=exOIIjOHpokVPgq2M25NWgNSSNRmJOG0&q=${query}&limit=10`).subscribe((resp: any) => {
      this.resultados = resp.data;
      console.log(this.resultados)
    })
  }

  
}


