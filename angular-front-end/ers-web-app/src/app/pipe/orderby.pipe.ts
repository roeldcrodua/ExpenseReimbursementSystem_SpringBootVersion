import { Pipe, PipeTransform } from '@angular/core';
import { Reimbursement } from '../model/reimbursement';

@Pipe({
  name: 'orderby'
})
export class OrderbyPipe implements PipeTransform {

  transform(array: Array<Reimbursement>, arg1: string, arg2: string): Array<any> {
    array.sort((a: any, b: any) => {
      if (arg1 != "" && (arg1.toUpperCase().match("ASC") || (arg1.toUpperCase().match("DESC")))){
        if (arg1.toUpperCase() == "DESC"){
          if (arg2.toUpperCase() == "DATESUBMITTED"){
            if (Date.parse(a.dateSubmitted).toString() < Date.parse(b.dateSubmitted).toString()) return 1;
            if (Date.parse(a.dateSubmitted).toString() > Date.parse(b.dateSubmitted).toString()) return -1;
            return 0;
          } else if (arg2.toUpperCase() == "DATERESOLVED"){
            if (Date.parse(a.dateResolved).toString() < Date.parse(b.dateResolved).toString()) return 1;
            if (Date.parse(a.dateResolved).toString() > Date.parse(b.dateResolved).toString()) return -1;
            return 0;
          } else if (arg2.toUpperCase() == "ID") {
            if (a.reimbId < b.reimbId) return 1;
            if (a.reimb > b.reimbId) return -1;
            return 0;
          } else if (arg2.toUpperCase() == "AMOUNT") {
            if (a.amount < b.amount) return 1;
            if (a.amount > b.amount) return -1;
            return 0;
          } else {
            if (a < b) return 1;
            if (a > b) return -1;
            return 0;
          }
        } else {
          if (arg2.toUpperCase() == "DATESUBMITTED"){
            if (Date.parse(a.dateSubmitted).toString() < Date.parse(b.dateSubmitted).toString()) return -1;
            if (Date.parse(a.dateSubmitted).toString() > Date.parse(b.dateSubmitted).toString()) return 1;
            return 0;
          } else if (arg2.toUpperCase() == "DATERESOLVED"){
            if (Date.parse(a.dateResolved).toString() < Date.parse(b.dateResolved).toString()) return -1;
            if (Date.parse(a.dateResolved).toString() > Date.parse(b.dateResolved).toString()) return 1;
            return 0;
          } else if (arg2.toUpperCase() == "ID") {
            if (a.reimbId < b.reimbId) return -1;
            if (a.reimb > b.reimbId) return 1;
            return 0;
          } else if (arg2.toUpperCase() == "AMOUNT") {
            if (a.amount < b.amount) return -1;
            if (a.amount > b.amount) return 1;
            return 0;
          } else {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
          } 
        }
      } else {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }
    });
    return array;
  }

}
