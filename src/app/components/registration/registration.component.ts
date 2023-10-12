import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormArray, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Gender, InputLanguageType } from 'src/app/models/enums';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LanguageProficiency } from 'src/app/models/language-proficiency';
import { LanguageService } from 'src/app/services/language.service';
import { Language } from 'src/app/models/language';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  languageProficiencies!: LanguageProficiency[];
  exchangeableLanguages!: Language[];
  InputLanguageType = InputLanguageType;

  selectedLanguageIds: number[] = [];
  
  constructor(
    // inject dependencies
    private userService: UserService,
    private languageService: LanguageService,
    private router: Router,
  ) {
    // redirect to home page if user try to access login page while logged in
    if (sessionStorage.getItem("loggedInUser")) {
      this.router.navigate(['/posts']).then(() =>
        window.location.reload()
      );
    }
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      email: new FormControl<string|null>(null, { 
        validators: [Validators.required, Validators.email], 
        asyncValidators: this.valueExistsValidator('email')
      }),
      username: new FormControl<string|null>(null, {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: this.valueExistsValidator('username')
      }),
      password: new FormControl<string|null>(null, [Validators.required, Validators.minLength(3)]), // set to 8 later
      confirmPassword: new FormControl<string|null>(null, Validators.required),
      gender: new FormControl<Gender>(Gender.Male, Validators.required),
      dob: new FormControl<Date>(new Date(), [Validators.required, this.invalidDobValidator()]),
      
      teachLanguages: new FormArray([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
      learnLanguages: new FormArray([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
      
      selfIntroduction: new FormControl<string|null>(null)
    }, { validators: this.mismatchPasswordValidator, updateOn: 'blur' });
    
    // call service to obtain list of languages and langauge proficiencies
    this.getExchangeableLanguages();
    this.getLanguageProficiencies();
  }

  /**
   * Checks if all the fields in the registration form is valid and make a 
   * registration request to the server via a service
   */
  registerUser(): void {
    console.log(this.registrationForm.value);

    if (this.registrationForm.valid) {
      let userBodyData = this.registrationForm.value;
      delete userBodyData["confirmPassword"];

      this.userService.registerUser(userBodyData as User)
        .subscribe(user => {
          let navigationExtras: NavigationExtras;
          if (user) {
            console.log(user);
            // Redirect to login page after registration, with data indicating success
            // https://stackoverflow.com/questions/58556569/angular-7-router-navigate-with-message-after-redirecting
            navigationExtras = {state: {registrationSuccess: true}};
          } else {
            navigationExtras = {state: {registrationSuccess: false}};
          }
          
          this.router.navigateByUrl('/', navigationExtras);
        });
    }
  }

  /**
   * The validator returns a configured validator function
   * which takes an Angular control object and returns either 
   * null if control object is valid or a validation error object.
   * 
   * https://angular.io/guide/form-validation#defining-custom-validators
   * 
   * @returns a validator for determining if password form control value is 
   * equal to confirm password form control value.
   */
  mismatchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.getRawValue();
    const confirmPassword = control.get('confirmPassword')?.getRawValue();

    return password === confirmPassword ? null : { 'mismatchPassword': true };
  };

  /**
   * https://zoaibkhan.com/blog/how-to-add-async-validation-to-angular-reactive-forms/
   * @param queryField field to query from server for existence of a particular value
   * @returns an asynchronous validation function (since we have to 
   * wait for HTTP response from server) to determine whether the value
   * the user entered for a particular queryField already exists
   */
  valueExistsValidator(queryField: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userService.valueExistsValidation(queryField, control.value).pipe(
        map((response) => (response ? { valueExists: true } : null)),
        catchError((err) => of(null))
      );
    };
  }

  /**
   * 
   * @returns a validator for checking if the provided dob is in the future
   * in which case invalid
   */
  invalidDobValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateOfBirth = new Date(control.value);
      return dateOfBirth > new Date() ? { 'invalidDob': true } : null
    }
  }

  get teachLanguagesFormArray() {
    return this.registrationForm.get("teachLanguages") as FormArray;
  }

  get learnLanguagesFormArray() {
    return this.registrationForm.get("learnLanguages") as FormArray;
  }
  
  /**
   * get and set list of available languages for language exchange
   */
  getExchangeableLanguages(): void {
    this.languageService.getExchangeableLanguages()
      .subscribe(languages => {
        this.exchangeableLanguages = languages;
      });
  }

  /**
   * get and set list of language proficiency levels
   */
  getLanguageProficiencies(): void {
    this.languageService.getLanguageProficiencies()
      .subscribe(proficiencies => {
        this.languageProficiencies = proficiencies;
      });
  }

  /**
   * update list of selected language IDs, which subsequently
   * update all child (exchange language) components with this 
   * variable injected with @Input()
   * @param updatedIds list of updated language IDs to set as 
   *  IDs of currently selected languages
   */
  updateSelectedLanguageIds(updatedIds: number[]) {
    this.selectedLanguageIds = updatedIds;
  }
}
