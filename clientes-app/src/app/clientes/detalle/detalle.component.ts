import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { TokenService } from 'src/app/usuarios/service/token.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;
  progreso: number = 0;
  isAdmin = false;
  isUser = false;
  // roles: string[];
  roles: string = '';
  constructor(private clienteService: ClienteService,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    public tokenService: TokenService,
    public facturaService: FacturasService) { }

  ngOnInit(): void {
    this.rolesMuestra();
    /*
    this.activatedRoute.paramMap.subscribe(params => {
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
    */
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire({
        title: 'Error seleccionar imagen: ',
        text: `El archivo debe ser de tipo imagen`,
        icon: 'error'
      })
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire({
        title: 'Error Upload',
        text: `Debe seleccionar una foto`,
        icon: 'error'
      })
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire({
            title: 'La foto se ha subido completamente!',
            text: response.mensaje,
            icon: 'success'
          })
        }
      });
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void{
    Swal
    .fire({
        title: "¿Esta seguro?",
        text: `¿Seguro que desea eliminar la factura ${factura.descripcion} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.facturaService.delete(factura.id).subscribe(
            response => {
              this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
              Swal.fire({
                title: 'Factura Eliminada',
                text: `Factura ${factura.descripcion} eliminada con exito!`,
                icon: 'success'
              })
            }
          )
        }
    });
  }

  rolesMuestra(): void {
    this.roles = this.tokenService.getAuthorities();
    if(this.roles !== ''){
      if (this.roles === "admin") {
        this.isAdmin = true;
        this.isUser = true;
      } 
      if (this.roles !== "admin") {
        this.isUser = true;
      }
    } else {
      this.isUser = false;
      this.isAdmin = false;
    }
  }

}
