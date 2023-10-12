# LanguageExchangeFrontend

## Tasks
- homepage (Posts)

- login
    - [x] display server login failed response
    - [x] store user session data
    - further improve security?
- [] registration
    - [x] email
        - [x] server side existence validation
    - [x] username
        - [x] server side existence validation
    - [] teach and learn languages
        - [x] get list of languages available for exchange from server api
        - [x] get list of proficiencies from server api
        - [] at least 1 of both type of languages
            - [x] disable remove button if there's only 1 remaining language row entry for a type
            - [x] min validation
            - [] display tooltip for disabled reason
        - [] at most 3 of both type of languages
            - [x] disable add button if there's 3 or more language row entries for a type
            - [x] max validation
            - [] display tooltip for disabled reason
        - [] each language can only be chosen once, if a language is chosen as teaching, it cannot be choosen as learning and vice versa
            - [] uniqueness validation
            - [x] globally disable language options by value (representing ID) of currently selected languages
    - [] validate form data on client side before sending off to server
    - [x] server rest controller for handling registration


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
