import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { InputLanguageType } from 'src/app/models/enums';
import { Language } from 'src/app/models/language';
import { LanguageProficiency } from 'src/app/models/language-proficiency';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-exchange-languages',
  templateUrl: './exchange-languages.component.html',
  styleUrls: ['./exchange-languages.component.css']
})
export class ExchangeLanguagesComponent implements OnInit {

  InputLanguageType = InputLanguageType;

  @Input() registrationForm!: FormGroup;
  @Input() languagesFormArray!: FormArray;
  @Input() languageProficiencies!: LanguageProficiency[];
  @Input() exchangeableLanguages!: Language[];
  @Input() inputLanguageType!: InputLanguageType;

  @Input() selectedLanguageIds!: number[];
  @Output() selectedLanguageIdsChange = new EventEmitter<number[]>();

  editingLanguageId?: number;

  constructor(
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    // add language form group to create initial registration form
    this.addLanguageFormGroup();
  }

  addLanguageFormGroup(): void {
    const languageGroup = new FormGroup({
      languageId: new FormControl<number>(0, Validators.required),
      proficiency: new FormControl<number>(0, Validators.required)
    });

    this.languagesFormArray.push(languageGroup);
  }

  removeLanguageFormGroup(index: number): void {
    let languageIdToRemove = this.languagesFormArray.at(index).value.languageId;

    // https://www.angularjswiki.com/angular/how-to-remove-an-element-from-array-in-angular-or-typescript/
    this.selectedLanguageIds.forEach((id, index)=>{
      if(id==languageIdToRemove) this.selectedLanguageIds.splice(index,1);
    });
    // emit updated list of selected languages to parent component, 
    // to enable removed languages
    this.selectedLanguageIdsChange.emit(this.selectedLanguageIds);

    // remove language row from form
    this.languagesFormArray.removeAt(index);
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

  onLanguageSelectClick(event: Event): void {
    this.editingLanguageId = parseInt((event.target as HTMLSelectElement).value);
  }

  /**
   * event handler for language selection change, emit updated list of 
   * selected languages to parent component, to disable newly selected languages
   * @param event language selection change event
   */
  onLanguageSelectChange(event: Event): void {
    // remove previously selected language from list to be disabled
    this.selectedLanguageIds.forEach((id, index)=>{
      if(id==this.editingLanguageId) this.selectedLanguageIds.splice(index,1);
    });

    let selectedLanguageId = (event.target as HTMLSelectElement).value;
    this.selectedLanguageIds.push(parseInt(selectedLanguageId));
    // emit event to change value in parent component
    this.selectedLanguageIdsChange.emit(this.selectedLanguageIds);
  }
}
