import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-stamp-duty-que',
  templateUrl: './stamp-duty-que.component.html',
  styleUrls: ['./stamp-duty-que.component.css'],
  animations: [
    trigger('pv', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('fb', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('SI', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('N', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
  ]
})
export class StampDutyQueComponent implements OnInit {
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  PropertyValue = '';
  calcData: any;
  PurchaseType = '';
  InvestmentProperty = '';
  PrimaryResidence = '';
  FirstTimeBuyer = '';
  foreignbuyer='';
  constructor(public validation: ValidationService,
    private dataService: DataService,
    private router: Router) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) {
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) {
      this.long = this.calcData.long;
    }
  
    
  }
  ngOnInit(): void {
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PurchaseType)) {
      this.PurchaseType = this.calcData.PurchaseType;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)) {
      this.foreignbuyer = this.calcData.ForeignBuyer;
    }
    // if (!this.dataService.EmptyNullOrUndefined(this.calcData.InvestmentProperty)) {
    //   this.InvestmentProperty = this.calcData.InvestmentProperty;
    // }
    // if (!this.dataService.EmptyNullOrUndefined(this.calcData.PrimaryResidence)) {
    //   this.PrimaryResidence = this.calcData.PrimaryResidence;
    // }
    // if (!this.dataService.EmptyNullOrUndefined(this.calcData.FirstTimeBuyer)) {
    //   this.FirstTimeBuyer = this.calcData.FirstTimeBuyer;
    // }
  }
  next(): void {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)) {
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g, '');
    } else {
      const element = document.getElementById('PropertyValue');
      element.classList.add('error-input');
      flag = false;
    }

    if (!this.dataService.EmptyNullOrUndefined(this.PurchaseType)) {
      this.calcData.PurchaseType = this.PurchaseType;
    } else {
      const element = document.getElementById('PurchaseType');
      element.classList.add('error-input');
      flag = false;
    }

    if (!this.dataService.EmptyNullOrUndefined(this.foreignbuyer)) {
      this.calcData.ForeignBuyer = this.foreignbuyer;
    } else {
      const element = document.getElementById('foreignbuyer');
      element.classList.add('error-input');
      flag = false;
    }

    // if (!this.dataService.EmptyNullOrUndefined(this.InvestmentProperty)){
    //   this.calcData.InvestmentProperty = this.InvestmentProperty;
    // }else{
    //   const element = document.getElementById('InvestmentProperty');
    //   element.classList.add('error-input');
    //   flag = false;
    // }

    // if (!this.dataService.EmptyNullOrUndefined(this.PrimaryResidence)){
    //   this.calcData.PrimaryResidence = this.PrimaryResidence;
    // }else{
    //   const element = document.getElementById('PrimaryResidence');
    //   element.classList.add('error-input');
    //   flag = false;
    // }
    // if (!this.dataService.EmptyNullOrUndefined(this.FirstTimeBuyer)){
    //   this.calcData.FirstTimeBuyer = this.FirstTimeBuyer;
    // }else{
    //   const element = document.getElementById('FirstTimeBuyer');
    //   element.classList.add('error-input');
    //   flag = false;
    // }
    if (flag) {
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/stamp-duty-calculator/result']);
    }
  }

  // valuesChange(ref: number){
  //   if(ref===1 && this.InvestmentProperty==='1'){
  //     this.PrimaryResidence='0';
  //     this.FirstTimeBuyer='0';
  //   }
  //   if(ref===2 && this.PrimaryResidence==='1'){
  //     this.InvestmentProperty='0';
  //     this.FirstTimeBuyer='0';
  //   }
  //   if(ref===3 && this.FirstTimeBuyer==='1'){
  //     this.PrimaryResidence='0';
  //     this.InvestmentProperty='0';
  //   }
  //   if((ref===2 || ref===3) && (this.PrimaryResidence==='0' && this.FirstTimeBuyer==='0')){
  //     this.InvestmentProperty='1';
  //   }
  // }
}
