import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/dashboard/services/dialog.service';
import { NotificacionesService } from 'src/app/dashboard/services/notificaciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private notificacionesService: NotificacionesService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  login() {
    this.http.post('http://localhost:3000/administrador/login', this.loginForm.value).subscribe(({ data }: any) => {
      if (data) {
        this.notificacionesService.showMessageExito('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']);
        return;
      }

      this.notificacionesService.showMessageError('Credenciales invalidas. Error al iniciar sesión');
    })
  }
}

