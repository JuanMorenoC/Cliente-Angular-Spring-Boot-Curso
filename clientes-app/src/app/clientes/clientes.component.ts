import { ClienteService } from './cliente.service';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { TokenService } from '../usuarios/service/token.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;
  isAdmin = false;
  isUser = false;
  // roles: string[];
  roles: string = '';
  constructor(public clienteService: ClienteService,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    public tokenService: TokenService) {
     }

  ngOnInit(): void {
    this.rolesMuestra();
    this.activatedRoute.paramMap.subscribe(params => {
      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap((response: any) => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        });
        })
      ).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });

    //this.roles = this.tokenService.getAuthorities();
    /*
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      } else if (rol === 'ROLE_USER'){
        this.isUser = true;
      }
    });
    */
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

  delete(cliente: Cliente): void {
    Swal
    .fire({
        title: "¿Esta seguro?",
        text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente)
              Swal.fire({
                title: 'Cliente Eliminado',
                text: `Cliente ${cliente.nombre} eliminado con exito!`,
                icon: 'success'
              })
            }
          )
        }
    });
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
