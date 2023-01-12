import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { LoginUsuario } from '../models/login-usuario';
import { TokenService } from '../service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  nombreUsuario: string;
  password: string;
  // roles: string[] = [];
  roles: string = '';
  errMsj: string;
  constructor(public tokenService: TokenService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe( 
      data => {
        this.isLogged = true;

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        // this.tokenService.setAuthorities(data.authorities);
        // console.log(data.authorities);
        // console.log(JSON.stringify(data.authorities));
        
        if (data.nombreUsuario === 'admin'){
          this.tokenService.setAuthorities('ROLE_ADMIN');
        } else {
          this.tokenService.setAuthorities('ROLE_USER');
        }
        
        // this.roles = data.authorities;
        Swal.fire({
          title: 'Bienvenido',
          text: 'Bienvenido ' + data.nombreUsuario,
          icon: 'success'
        })
        this.router.navigateByUrl('clientes').then(() => {
          window.location.reload();
        });
      },
      err => {
        this.isLogged = false;
        this.errMsj = err.error.message;
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
