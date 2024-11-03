import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotService } from 'src/app/services/forgot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  email: string;
  message: string = '';
  phoneNumber: string | null = null;   otp = '';
  newPassword = '';
  confirmPassword = '';
  isOtpSent = false;
  emailError: string | null = null;

  constructor(private forgotservice: ForgotService, private router: Router) { }

  ngOnInit(): void {
  }

  validateEmailFormat(email: any): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  }


sendOtp() {
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = null;

    if (!this.email) {
        this.email=null;
        this.emailError = 'Email is required';
        return;
    } else if (!emailPattern.test(this.email)) {
        this.email=null;
        this.emailError = 'Please enter a valid email address in the format: yourname@example.com';
        return;
    }

    // Call the forgotPassword service
    this.forgotservice.forgotPassword(this.email).subscribe(
        (response: any) => {
            const generatedOtp = response.otp;          
            localStorage.setItem('generatedOtp', generatedOtp);  // Store OTP locally
            localStorage.setItem('email', this.email);           // Store email locally

            // Show success message and redirect to OTP verification page
            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                text: 'An OTP has been sent to your registered email address for password reset.'
            }).then(() => {
                // Clear email field and navigate to the OTP verification page
                this.email = null;
                this.router.navigate(['/otpverification']);
            });
        },
        error => {
            // Handle errors with appropriate messages
            if (error.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Request',
                    text: 'Please check your email address and try again.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Email Not Registered',
                    text: 'Your email is not registered.Before password reset register with this email.'
                });
            }
        }
    );
}


}
