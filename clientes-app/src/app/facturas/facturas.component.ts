import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, NgModel} from '@angular/forms';
import {Observable} from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  public titulo: string ='Nueva Factura';
  public factura: Factura = new Factura();
  public facturas: Factura = new Factura();

  autocompleteControl = new FormControl();
  
  productosFiltrados: Observable<Producto[]>;

  constructor(public clienteService: ClienteService,
    public facturaService: FacturasService,
    private router: Router,
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value : value.nombre),
      mergeMap(value => value ? this._filter(value) : [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProductos(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void{
    let cantidad: number = event.target.value as number;

    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id:number): void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(): void {
    console.log('factura');
    console.log(this.factura);
    console.log(this.factura.descripcion);
    
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal
      .fire({
        title: this.titulo,
        text: `Factura ${factura.descripcion} creada con éxito!`,
        icon: 'success'
      });
      this.router.navigate(['/clientes']);
    });
    
  }

}
