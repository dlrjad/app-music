import { Component, OnInit } from '@angular/core';

import { UserServices } from '../services/user.services';
import { User } from '../models/user';

import { GLOBAL } from '../services/global';

declare var $:any; 

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserServices]
})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user:User;
    public identity;
    public token;
    public alertMessage;
    public url:String;
    public aux;

    constructor(
        private _userServices: UserServices
    ){
        this.titulo = 'Actualizar mis datos';
        
        //LocalStorage
        this.identity = this._userServices.getIdentity();
        this.token = this._userServices.getToken();

        this.url = GLOBAL.url;
        this.user = this.identity;
    }

    ngOnInit(){
        console.log('user-edit.component.ts cargado');
    }

    onSubmit(){
        console.log(this.user);
        localStorage.setItem('aux', JSON.stringify(this.user));
        this._userServices.updateUser(this.user).subscribe(
            
            response => {
                if(!response.user){
                    this.alertMessage = "El usuario no se ha actualizado";
                }else{
                    
                    this.user = response.user; //nos da valor del servidor aun no actualizado
                    //usamos localStorage aux
                    let aux = JSON.parse(localStorage.getItem('aux'));

                    localStorage.setItem('identity', JSON.stringify(this.user));

                    $("#identity_name").html(aux.name+ " "+aux.surname);

                    this.alertMessage = "El usuario se ha actualizado correctamente";

                    if(!this.filesToUpload){
                        
                    }else{
                        this.makeFileRequest(this.url+"upload-image-user/"+this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                let image_path = this.url+'get-image-user/'+this.user.image;
                                $("#image-logged").attr('src', image_path);
                                
                            }
                        );
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                }
            }
        );
    }

    public filesToUpload: Array<File>
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        //console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        //var token = this.token;
        var token = this._userServices.getToken();

        return new Promise(function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0; i<files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }

}