import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = `http://localhost:8081/api/clientes`;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
    private router: Router) { }

    getRegiones(): Observable<Region[]>{
      return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
    }

  getClientes(page: number): Observable<Cliente[]> {
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        }
        )
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => { cliente.nombre = cliente.nombre.toUpperCase();
        // registerLocaleData(localeES, 'es');
        // cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
      return cliente;
    });
    return response;
    }),
    tap(response => {
      console.log('ClienteService: tap 2');
      (response.content as Cliente[]).forEach( cliente => {
        console.log(cliente.nombre);
      }
      )
    })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire({
          title: 'Error al crear al cliente',
          text: e.error.mensaje + ' o ' + e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire({
          title: 'Error al editar',
          text: e.error.mensaje,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire({
          title: 'Error al editar al cliente',
          text: e.error.mensaje + ' o ' + e.error.error,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire({
          title: 'Error al eliminar al cliente',
          text: e.error.mensaje + ' o ' + e.error.error
          ,
          icon: 'error'
        });
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
