import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userservice:UsersService, private router: Router) { }

  user: Login = {         // Use the User model to store form data
    email: "",
    password: "",
  }


  onSubmit() {
      this.userservice.login(this.user).subscribe({
        next: (response) => {
          console.log('Login successful', response);


          if(response.message == "Login added successfully")
          {
            const userName =this.user.email;
            localStorage.setItem('email', userName);
          }

          this.router.navigate(['/home']); 
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }



}
