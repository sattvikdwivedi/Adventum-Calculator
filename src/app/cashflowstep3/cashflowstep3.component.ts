import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cashflowstep3',
  templateUrl: './cashflowstep3.component.html',
  styleUrls: ['./cashflowstep3.component.css']
})
export class Cashflowstep3Component implements OnInit {
  foreignbuyer: string = '1';
  stampDutyLandTax: string = '';
  loanOriginationFee: string = '';
  letteingManagFee: string = '';
  groundRent: string = '';
  serviceCharges: string = '';
  miscelleneousExpense: string = '';
  mortgageInterestRate: string = '';
  calcData: any;
  PropertyLondon: any;

  // Preview values
  grossAnnual: number = 0;
  netAnnual: number = 0;
  netYield: number = 0;

  private propertyValue: number = 0;
  private loanAmount: number = 75;
  private rentalYield: number = 0;
  private country: string = 'england';

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData')) || {};

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)) {
      this.foreignbuyer = this.calcData.ForeignBuyer;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.stampDutyLandTax)) {
      this.stampDutyLandTax = this.validation.amountWithComma(this.calcData.stampDutyLandTax);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee)) {
      this.loanOriginationFee = this.calcData.loanOriginationFee + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)) {
      this.letteingManagFee = this.calcData.letteingManagFee + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.groundRent)) {
      this.groundRent = this.validation.amountWithComma(this.calcData.groundRent);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges)) {
      this.serviceCharges = this.validation.amountWithComma(this.calcData.serviceCharges);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense)) {
      this.miscelleneousExpense = this.validation.amountWithComma(this.calcData.miscelleneousExpense);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageInterestRate)) {
      this.mortgageInterestRate = this.calcData.mortgageInterestRate + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.propertyValue = parseFloat(this.calcData.PropertyValue.toString().replace(/,/g, '')) || 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanAmount)) {
      this.loanAmount = parseFloat(this.calcData.loanAmount) || 75;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)) {
      this.rentalYield = parseFloat(this.calcData.rentalYeild) || 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.Country)) {
      this.country = this.calcData.Country;
    }
  }

  ngOnInit(): void {
    this.PropertyLondon = localStorage.getItem('PropertyLondon');
    // Auto-calculate stamp duty if not already set
    if (!this.stampDutyLandTax && this.propertyValue > 0) {
      this.calculateStampDuty();
    }
    this.updatePreview();
  }

  resolveApiCountry(raw: string): string {
    if (!raw) return 'england';
    const r = raw.toLowerCase().trim();
    if (r === 'scotland') return 'scotland';
    if (r === 'wales') return 'wales';
    if (r === 'northern-ireland' || r === 'northern ireland') return 'northern-ireland';
    return 'england';
  }

  calculateStampDuty() {
    const apiCountry = this.resolveApiCountry(this.country);
    this.dataService.GetRequest(
      'https://api.propertydata.co.uk/stamp-duty-calculator?key=' + environment.PropertyDataKey +
      '&value=' + this.propertyValue + '&country=' + apiCountry + '&mode=investment'
    ).subscribe(
      (res: any) => {
        const obj = JSON.parse(JSON.stringify(res));
        if (obj.status === 'success') {
          let sdlt = obj.transaction_tax_payable;
          if (this.foreignbuyer === '1') {
            sdlt = sdlt + (this.propertyValue * 2 / 100);
          }
          this.stampDutyLandTax = this.validation.amountWithComma(Math.round(sdlt).toString());
          this.updatePreview();
        } else {
          this.stampDutyLandTax = this.validation.amountWithComma(
            this.calculateSdltFallback(this.propertyValue, this.foreignbuyer === '1').toString()
          );
          this.updatePreview();
        }
      },
      (_err) => {
        this.stampDutyLandTax = this.validation.amountWithComma(
          this.calculateSdltFallback(this.propertyValue, this.foreignbuyer === '1').toString()
        );
        this.updatePreview();
      }
    );
  }

  calculateSdltFallback(value: number, isForeignBuyer: boolean): number {
    let sdlt = 0;
    if (value > 250000) sdlt += Math.min(value - 250000, 675000) * 0.05;
    if (value > 925000) sdlt += Math.min(value - 925000, 575000) * 0.10;
    if (value > 1500000) sdlt += (value - 1500000) * 0.12;
    sdlt += value * 0.05; // additional dwelling surcharge
    if (isForeignBuyer) sdlt += value * 0.02;
    return Math.round(sdlt);
  }

  updatePreview() {
    const mortgageRate = parseFloat((this.mortgageInterestRate || '4.7').replace('%', '')) || 4.7;
    const loan = this.propertyValue * (this.loanAmount / 100);
    const lettingFeeRate = parseFloat((this.letteingManagFee || '12').replace('%', '')) || 12;
    const grd = parseFloat((this.groundRent || '0').replace(/,/g, '')) || 0;
    const svc = parseFloat((this.serviceCharges || '0').replace(/,/g, '')) || 0;
    const oth = parseFloat((this.miscelleneousExpense || '0').replace(/,/g, '')) || 0;
    this.grossAnnual = this.propertyValue * (this.rentalYield / 100);
    const lettings = this.grossAnnual * (lettingFeeRate / 100);
    const mortgageInt = loan * (mortgageRate / 100);
    this.netAnnual = this.grossAnnual - lettings - (grd + svc + oth) - mortgageInt;
    this.netYield = this.propertyValue > 0 ? (this.netAnnual / this.propertyValue) * 100 : 0;
  }

  next() {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.stampDutyLandTax)) {
      this.calcData.stampDutyLandTax = this.stampDutyLandTax.replace(/,/g, '');
    } else {
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.loanOriginationFee)) {
      this.calcData.loanOriginationFee = this.loanOriginationFee.replace('%', '');
    } else {
      this.calcData.loanOriginationFee = '0';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.letteingManagFee)) {
      this.calcData.letteingManagFee = this.letteingManagFee.replace('%', '');
    } else {
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.groundRent)) {
      this.calcData.groundRent = this.groundRent.replace(/,/g, '');
    }
    if (!this.dataService.EmptyNullOrUndefined(this.serviceCharges)) {
      this.calcData.serviceCharges = this.serviceCharges.replace(/,/g, '');
    }
    if (!this.dataService.EmptyNullOrUndefined(this.miscelleneousExpense)) {
      this.calcData.miscelleneousExpense = this.miscelleneousExpense.replace(/,/g, '');
    }
    if (!this.dataService.EmptyNullOrUndefined(this.mortgageInterestRate)) {
      this.calcData.mortgageInterestRate = this.mortgageInterestRate.replace('%', '');
    } else {
      flag = false;
    }
    // Set mortgage fields expected by result component
    this.calcData.optmortgage = '1';
    this.calcData.mortgageType = '1';
    this.calcData.foreignbuyer = this.foreignbuyer;
    // Set defaults for fields not collected in cashflow flow
    if (this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)) {
      this.calcData.homecurrency = '1';
    }
    if (this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)) {
      this.calcData.fxgrowth = '0';
    }

    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/cashflow/result']);
    }
  }
}
