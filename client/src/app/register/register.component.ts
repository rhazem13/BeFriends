import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  loading: boolean = false;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadCountries();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.alphanumericValidator,
        ],
      ],
      knownAs: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          this.passwordValidator,
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
      console.log(this.registerForm.controls.username.value);
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  public myError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  };

  register() {
    this.loading = true; // Set loading to true when signup is initiated
    this.registerForm
      .get('dateOfBirth')
      .setValue(
        new Date(this.registerForm.controls['dateOfBirth'].value)
          .toISOString()
          .slice(0, 10)
      );
    console.log(this.registerForm.value);

    this.accountService.register(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigateByUrl('/members');
      },
      (error) => {
        this.validationErrors = error;
      },
      () => {
        this.loading = false;
      }
    );


  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  alphanumericValidator(control: FormControl) {
    const pattern = /^[a-zA-Z0-9]+$/; // Regular expression pattern for alphanumeric characters
    return pattern.test(control.value) ? null : { invalidUsername: true };
  }

  passwordValidator(control: FormControl) {
    const value = control.value;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    const valid = hasUppercase && hasLowercase && hasNumber;
    return valid ? null : { invalidPassword: true };
  }

  loadCountries() {
    this.http
      .get<any[]>('https://restcountries.com/v3.1/all')
      .pipe(map((response) => response.map((country) => country.name.common)))
      .subscribe((countries) => {
        this.countries = countries;
      });
  }

  onCountryChange() {
    const selectedCountry = this.registerForm.get('country').value;

    this.getCities(selectedCountry).subscribe((cities) => {
      this.cities = cities;
      console.log(this.cities);
    });
  }

  getCities(country: string): Observable<string[]> {
    const endpoint = `https://secure.geonames.org/searchJSON?q=${country}&maxRows=10&username=rhazem13`;

    return this.http.get<any>(endpoint).pipe(
      map((response) => {
        const cities = response.geonames.map((city: any) => city.name);
        console.log(cities);
        return cities;
      })
    );
  }
}
