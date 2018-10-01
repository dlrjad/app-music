import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserServices } from './services/user.services';
import { Response } from '@angular/http';
import { GLOBAL } from './services/global';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserServices]
})
export class AppComponent implements OnInit{
  public title = 'APPMUSIC';
  public user : User;
  public user_register : User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url:String;

  constructor(
    private _userServices:UserServices,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    /*var texto = this._userServices.signup();
    console.log(texto);*/
    this.identity = this._userServices.getIdentity();
    this.token = this._userServices.getToken();
    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    console.log(this.user);
    //Conseguir los datos del usuario identificado
    this._userServices.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if(!this.identity._id){
          alert("El usuario no esta correctamente identificado");
        }else{
          //Crear elemento en el localStorage para tener sesion de usuario
          localStorage.setItem('identity', JSON.stringify(identity));

          //console.log(response);
          //Conseguir el token para enviarseloa cada peticion http
          this._userServices.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token; //response.user
              this.token = token;
              if(this.token.length <= 0){
                alert("El token no se ha guardado correctamente");
              }else{
                //Crear elemento en el localStorage para tener token disponible
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
                console.log(token);
                console.log(identity);
              }

            },
            error => {
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
        
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );

  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); 
    this.identity = null;
    this.token = null;
    this.errorMessage = "";
    this.alertRegister = "";
    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userServices.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        console.log("id: ");
        console.log(this.user_register._id);

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, indentificate con '+ this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage !=null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }

}
