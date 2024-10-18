import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: Users = {  
    firstName : "",
    lastName: "" ,
    email: "",
    password: "",
    phoneNum: 0

  }

  constructor(private userservice:UsersService, private router: Router) { }

  ngOnInit(): void {
  }
   
  onRegister()
  {
    this.userservice.signUp(this.user).subscribe(
      (response) => {
        console.log('User registered successfully', response);

        if(response.message == "Account Created Successfully")
          {
            const userName =this.user.email;
            localStorage.setItem('email', userName);
          }
        
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error during registration', error);
      }
    );

  }

}
