import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-cashflowstep2',
  templateUrl: './cashflowstep2.component.html',
  styleUrls: ['./cashflowstep2.component.css']
})
export class Cashflowstep2Component implements OnInit {
  investedTenure: string = '';
  rentalYeild: string = '';
  rentalGrowthEscalation: string = '';
  calcData: any;

  // Preview values
  grossAnnual: number = 0;
  netAnnual: number = 0;
  netYield: number = 0;

  // These will come from step1 via calcData
  propertyValue: number = 0;
  loanAmount: number = 75;

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData')) || {};
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)) {
      this.investedTenure = this.calcData.investedTenure;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)) {
      this.rentalYeild = this.calcData.rentalYeild + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalGrowthEscalation)) {
      this.rentalGrowthEscalation = this.calcData.rentalGrowthEscalation + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.propertyValue = parseFloat(this.calcData.PropertyValue.toString().replace(/,/g, '')) || 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanAmount)) {
      this.loanAmount = parseFloat(this.calcData.loanAmount) || 75;
    }
  }

  ngOnInit(): void {
    this.updatePreview();
  }

  updatePreview() {
    const yld = parseFloat((this.rentalYeild || '').replace('%', '')) || 0;
    const mortgageRate = 4.7; // default estimate for preview
    const loan = this.propertyValue * (this.loanAmount / 100);
    this.grossAnnual = this.propertyValue * (yld / 100);
    const mortgageInt = loan * (mortgageRate / 100);
    const expenses = 4500; // default estimate for preview
    this.netAnnual = this.grossAnnual - (this.grossAnnual * 0.12) - expenses - mortgageInt;
    this.netYield = this.propertyValue > 0 ? (this.netAnnual / this.propertyValue) * 100 : 0;
  }

  next() {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.investedTenure)) {
      this.calcData.investedTenure = this.investedTenure;
    } else {
      let element = document.getElementById('investedTenure');
      if (element) element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.rentalYeild)) {
      this.calcData.rentalYeild = this.rentalYeild.replace('%', '');
    } else {
      let element = document.getElementById('rentalYeild');
      if (element) element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.rentalGrowthEscalation)) {
      this.calcData.rentalGrowthEscalation = this.rentalGrowthEscalation.replace('%', '');
    } else {
      let element = document.getElementById('rentalGrowthEscalation');
      if (element) element.classList.add('error-input');
      flag = false;
    }
    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/cashflow/step3']);
    }
  }
}
