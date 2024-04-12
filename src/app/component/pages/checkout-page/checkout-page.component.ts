import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CartService } from "../../../services/cart.service";
import { UserService } from "../../../services/user.service";
import { Order } from "../../../shared/models/order";
import { FormControl } from "@angular/forms";


import { Router } from "@angular/router";
import * as L from 'leaflet';
// import {AddressService} from "../../../services/address.service";
import {HttpErrorResponse} from "@angular/common/http";


interface BookingResponse {
  message: string;
  data:any;
}

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, AfterViewInit {
  name: string = '';
  phoneNumber: string = '';
  email: string = '';
  nameError: string = '';
  phoneError: string = '';
  emailError: string = '';
  submissionSuccess: boolean = false;
  errorMessage: string = '';
  order: Order = new Order();
  checkoutForm!: FormGroup;
  fc = {
    name: new FormControl(''), // Define as FormControl instance
    address: new FormControl('')
    // name: new FormControl(''),
    // address: new FormControl('')
  };

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    // private addressService: AddressService,
    private router: Router
  ) {
    const cart = this.cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }
  bookEvent() {
    // console.log('Form Submitted');

    // Check if the form is valid and the date is valid
    if (this.isValidForm() && this.isDateValid()) {
      const eventData = {
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.email,

      };

      // this.addressService.bookEvent(eventData).subscribe(
      //   (response: BookingResponse) => {
      //     console.log('Order booked successfully', response);
      //     this.submissionSuccess = true;
      //     setTimeout(() => {
      //       this.submissionSuccess = false;
      //     }, 5000);
      //   },
      //   (error: HttpErrorResponse) => {
      //     console.error('Error booking order', error);
      //     this.errorMessage = 'Error occurred while submitting the form.';
      //   }
      // );
    } else {
      // Validation errors, do nothing
    }
  }

  isValidForm() {
    this.nameError = '';
    this.phoneError = '';
    this.emailError = '';


    let isValid = true;

    if (this.name.trim().length === 0) {
      this.nameError = 'Please enter your name.';
      isValid = false;
    } else if (/\d/.test(this.name.trim())) {
      this.nameError = 'Name should not contain numbers.';
      isValid = false;
    }

    if (this.phoneNumber.trim().length === 0) {
      this.phoneError = 'Please enter your phone number.';
      isValid = false;
    } else if (!/^\d+$/.test(this.phoneNumber.trim())) {
      this.phoneError = 'Phone number should contain only digits.';
      isValid = false;
    }

    if (this.email.trim().length === 0) {
      this.emailError = 'Please enter your email address.';
      isValid = false;
    } else if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(this.email.trim())) {
      this.emailError = 'Please enter a valid email address.';
      isValid = false;
    }



    return isValid;
  }



  onPhoneNumberChange() {
    // Check if the phone number contains non-digit characters
    if (/\D/.test(this.phoneNumber.trim())) {
      this.phoneError = 'Phone number should contain only digits.';
    } else if (this.phoneNumber.trim().length !== 10) {
      this.phoneError = 'Phone number should contain exactly 10 digits.';
    } else {
      this.phoneError = ''; // Clear the error message if the phone number is valid
    }
  }


  checkName() {
    if (!/^[a-zA-Z\s]*$/.test(this.name.trim())) {
      this.nameError = 'Name should only contain alphabets and white spaces.';
    } else {
      this.nameError = ''; // Clear the error message if the name is valid
    }
  }
  clearForm() {
    // Clear form fields
    this.name = '';
    this.phoneNumber = '';
    this.email = '';

  }


  private isDateValid() {
    return false;
  }

  ngOnInit() {
    let { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      'name': [name, Validators.required],
      'address': [address, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }

  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning('please fill the inputs', 'Invalid Inputs');
      return;
    }

    if (!this.order.addressLatLng) {
      this.toastrService.warning('please select your location on the map', 'Location');
      return;
    }

    // Navigate to the payment page
    this.router.navigate(['/payment-page']);

    console.log(this.order);
  }
}
