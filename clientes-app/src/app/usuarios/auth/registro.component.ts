import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { NuevoUsuario } from '../models/nuevo-usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  nuevoUsuario: NuevoUsuario;
  nombre: string;
  nombreUsuario: string;
  email: string;
  password: string;
  errMsj: string;
  isLogged = false;

  constructor(public tokenService: TokenService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    }
  }

  onRegister(): void {
    this.nuevoUsuario = new NuevoUsuario(this.nombre, this.nombreUsuario, this.email, this.password);
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      data => {
        Swal.fire({
          title: 'Cuenta Creada',
          text: 'Cuenta Creada con exito señor/a ' + this.nombreUsuario,
          icon: 'success'
        })

        this.router.navigate(['/login']);
      },
      err => {
        this.errMsj = err.error.mensaje;
        Swal.fire({
          title: 'Error',
          text: this.errMsj,
          icon: 'error'
        })
        // console.log(err.error.message);
      }
    );
  }

}
