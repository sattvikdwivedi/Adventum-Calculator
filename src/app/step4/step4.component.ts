import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service'
import{Router} from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {
  stampDutyLandTax: string = "";
  loanOriginationFee: string = "";
  calcData: any;
  lat: number = 0;
  long: number = 0;
  country: string = "";
  PropertyValue: string = "";
  letteingManagFee: string = "";
  groundRent: string = "";
  serviceCharges: string = "";
  miscelleneousExpense: string = "";
  legalFees: string = "";
  PropertyLondon: any;

  // Computed display values for left panel
  processingFeeAmount: string = "";
  acquisitionTotal: string = "";
  runningCostTotal: string = "";
  year1Total: string = "";

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem("calcData") || '{}');

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.stampDutyLandTax)) {
      this.stampDutyLandTax = this.validation.amountWithComma(this.calcData.stampDutyLandTax);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee)) {
      this.loanOriginationFee = this.calcData.loanOriginationFee;
    }
    if (this.calcData.optmortgage === "0") {
      this.loanOriginationFee = "0";
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) {
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) {
      this.long = this.calcData.long;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.Country)) {
      this.country = this.calcData.Country;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.calcData.PropertyValue;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)) {
      this.letteingManagFee = this.calcData.letteingManagFee;
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
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.legalFees)) {
      this.legalFees = this.validation.amountWithComma(this.calcData.legalFees);
    }
  }

  ngOnInit(): void {
    this.PropertyLondon = localStorage.getItem("PropertyLondon");

    this.dataService.GetRequest(
      'https://api.propertydata.co.uk/stamp-duty-calculator?key=' + environment.PropertyDataKey +
      '&value=' + this.PropertyValue + '&country=' + this.country + '&mode=investment'
    ).subscribe((res: Response) => {
      var obj = JSON.parse(JSON.stringify(res));
      if (obj.status === "success") {
        if (this.calcData.ForeignBuyer === "1") {
          this.stampDutyLandTax = this.validation.amountWithComma(
            (parseFloat(obj.transaction_tax_payable) + (parseFloat(this.calcData.PropertyValue) * 0.02)).toString()
          );
        } else {
          this.stampDutyLandTax = this.validation.amountWithComma(obj.transaction_tax_payable.toString());
        }
        this.calcTotals();
      }
    });
  }

  onFeeChange() {
    this.calcTotals();
  }

  calcTotals() {
    const sdlt = parseFloat((this.stampDutyLandTax || '0').replace(/,/g, '')) || 0;
    const propVal = parseFloat((this.PropertyValue || '0').replace(/,/g, '')) || 0;
    const feeRate = parseFloat(this.loanOriginationFee || '0') || 0;
    const loanAmt = propVal * (parseFloat(this.calcData.loanAmount || '0') / 100);
    const procFee = loanAmt * (feeRate / 100);
    const legal = parseFloat((this.legalFees || '0').replace(/,/g, '')) || 0;
    const misc = parseFloat((this.miscelleneousExpense || '0').replace(/,/g, '')) || 0;

    this.processingFeeAmount = procFee > 0 ? this.validation.amountWithComma(Math.round(procFee).toString()) : '0';

    const acqTotal = sdlt + procFee + legal + misc;
    this.acquisitionTotal = acqTotal > 0 ? this.validation.amountWithComma(Math.round(acqTotal).toString()) : '';

    const svcCharges = parseFloat((this.serviceCharges || '0').replace(/,/g, '')) || 0;
    this.runningCostTotal = svcCharges > 0 ? this.validation.amountWithComma(Math.round(svcCharges).toString()) : '';

    const yr1 = acqTotal + svcCharges;
    this.year1Total = yr1 > 0 ? this.validation.amountWithComma(Math.round(yr1).toString()) : '';
  }

  next() {
    this.calcData.stampDutyLandTax = this.stampDutyLandTax ? this.stampDutyLandTax.replace(/,/g, '') : '0';
    this.calcData.loanOriginationFee = this.loanOriginationFee || '0';
    this.calcData.letteingManagFee = this.letteingManagFee || '0';
    this.calcData.groundRent = this.groundRent ? this.groundRent.replace(/,/g, '') : '0';
    this.calcData.serviceCharges = this.serviceCharges ? this.serviceCharges.replace(/,/g, '') : '0';
    this.calcData.miscelleneousExpense = this.miscelleneousExpense ? this.miscelleneousExpense.replace(/,/g, '') : '0';
    this.calcData.legalFees = this.legalFees ? this.legalFees.replace(/,/g, '') : '0';
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem("calcData", JSON.stringify(this.calcData));
    this.router.navigate(['/calculated-irr']);
  }
}
