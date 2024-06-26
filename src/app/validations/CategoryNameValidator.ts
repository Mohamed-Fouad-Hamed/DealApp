import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap  } from 'rxjs/operators';
import { APIService } from '../services/API/api.service';



@Injectable({
  providedIn: 'root'
})
export class CategoryNameValidator implements AsyncValidator {
 
  constructor(private http: HttpClient , private apiService:APIService) {}

  private searchCategoryName(text:string) {
    // debounce
    const URL = this.apiService.apiHost;

    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(`${URL}/category-name?id=${text}`)
        })
      );
  }
  
  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null>  {
    const result =  this.searchCategoryName(control.value)
      .pipe(
        map((res) => ( res === true ? { notUnique: true } : null) ) ,
        catchError(() => of(null)),
      );
      return result;
  }

  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

}
