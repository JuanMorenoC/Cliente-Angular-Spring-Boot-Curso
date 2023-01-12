import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo:string = "Crear Cliente";
  public errores: string[];
  constructor(public clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Nuevo cliente',
          text: `Cliente ${json.cliente.nombre} creado con exito!`,
          icon: 'success'
        })
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(json => {
      this.router.navigate(['/clientes'])
      Swal.fire({
        title: 'Cliente actualizado',
        text: `Cliente ${json.cliente.nombre} actualizado con exito!`,
        icon: 'success'
      })
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null || o1 == undefined || o2 == undefined ? false : o1.id === o2.id; 
  }

}
