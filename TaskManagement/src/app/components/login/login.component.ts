import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;

  constructor(private userservice:UsersService, private router: Router) { }

  user: Login = {         // Use the User model to store form data
    email: "",
    password: "",
  }

 validateEmail = false;
 validatePasswordmsg = false;
 emailErrorMessage : string = "";
 passwordErrorMessage: string = "";
 isPasswordVisible:boolean = false;

  resetForm(){
   this.user = {};
   this.validateEmail = false;
   this.validatePasswordmsg = false;   

  }

  validateEmailFormat(email: any): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  }

  validatePassword(password: any): boolean {
    if (password.length < 7) {
      return false;
    } 
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharacters.test(password)) {
      return false;
    }
    return true;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordInput.nativeElement.type = this.isPasswordVisible ? 'text' : 'password';
  }


  onSubmit() {
    this.validateEmail = false;
    this.validatePasswordmsg = false;

    // Frontend validation for email and password
    if (!this.user.email) {
        this.validateEmail = true;
        this.emailErrorMessage = "Email is Required";
    } else if (!this.validateEmailFormat(this.user.email)) {
        this.validateEmail = true;
        this.user.email = '';
        this.emailErrorMessage = "Please enter a valid email address in lowercase ending with '@gmail.com'.";
    }

    if (!this.user.password) {
        this.validatePasswordmsg = true;
        this.passwordErrorMessage = "Password is Required.";
    } else if (!this.validatePassword(this.user.password)) {
        this.validatePasswordmsg = true;
        this.user.password = '';
        this.passwordErrorMessage = "Password must be at least 7 characters along with one special character.";
    }

    // If there are validation errors, stop the login process
    if (this.validateEmail || this.validatePasswordmsg) {
        return;
    }

    // Call the backend to login
    this.userservice.login(this.user).subscribe({
        next: (response) => {
            console.log('Login successful', response);

            // Check if login is successful based on backend response
            if (response?.token) {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }

                if (this.user.email) {
                    localStorage.setItem('email', this.user.email);
                }

                // Show SweetAlert popup for successful login
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in!',
                }).then(() => {
                    // After the user clicks "OK" on the popup, navigate to the home page
                    console.log("Navigating to home...");
                    this.router.navigate(['/home']);
                    this.resetForm();
                });

            } else {
                // Show SweetAlert popup for invalid username or password
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password. Please try again.',
                });
            }
        },
        error: (error) => {
            console.error('Login failed', error);
            // Show SweetAlert popup for failed login
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Login failed: Invalid username or password.',
            });
        }
    });
}


}