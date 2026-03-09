import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../validation.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { trigger,state,style,animate,transition } from '@angular/animations';
import { environment } from '../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-estimated-rent-que',
  templateUrl: './estimated-rent-que.component.html',
  styleUrls: ['./estimated-rent-que.component.css'],
  animations: [
    trigger('pv',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('pv',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('RY',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    ]
})
export class EstimatedRentQueComponent implements OnInit {
  PropertyLondon:any;
  MapLoad = true;
  lat: number;
  long: number;
  PropertyValue = '';
  rentalYeild = '';
  calcData: any;
  homecurrency='';
  homecurrencyText:string=""; 
  constructor(public validation: ValidationService,
              private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);

    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
       this.PropertyValue=this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)){
      this.rentalYeild=this.calcData.rentalYeild+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
      this.homecurrencyText=this.calcData.homecurrencyText;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
      this.homecurrency=this.calcData.homecurrency;
    }
    // $(document).ready(function(){
    //   $(".percent").on('input', function() {
    //     $(this).val(function(i, v) {
    //      return v.replace('%','') + '%';  });
    //   });
    // });
  }
  async homecurrencyChange(){
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
      this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
      var FinalRate=0;
      let Currpromise = new Promise((res, rej) => {
        this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
          try {
            let res1 = data;
            if(res1.success==true){
              var GBP_Rate = res1.rates['GBP']
              var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
              if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
                FinalRate= parseFloat((HC_Rate/GBP_Rate).toFixed(2));
                this.homecurrency=FinalRate.toString();
                this.calcData.homecurrency=this.homecurrency;
              }
            }
            res(res1);
          }
          catch (ex) {
            rej(false);
          }
        })
      });
      await Currpromise;
    }
   }
  async next() {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g,'');
    }else{
      const element = document.getElementById('propertyValue');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.rentalYeild)){
      this.calcData.rentalYeild = this.rentalYeild.replace("%",'');
    }else{
      const element = document.getElementById('rentalYeild');
      element.classList.add('error-input');
      flag = false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
      // this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
      // var FinalRate=0;
      // let Currpromise = new Promise((res, rej) => {
      //   this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
      //     try {
      //       let res1 = data;
      //       if(res1.success==true){
      //         var GBP_Rate = res1.rates['GBP']
      //         var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
      //         if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
      //           FinalRate= HC_Rate/GBP_Rate;
      //           this.HomeCurrency=FinalRate.toString();
      //           this.calcData.homecurrency=FinalRate;
      //         }
      //       }
      //       res(res1);
      //     }
      //     catch (ex) {
      //       rej(false);
      //     }
      //   })
      // });
      // await Currpromise;
    }else{
      let element=document.getElementById("HomeCurrency");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrency)){
      this.calcData.homecurrency=this.homecurrency;
    }else{
      let element=document.getElementById("homecurrencyvalue");
      element.classList.add("error-input");
      flag=false;
    }
    if (flag){
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/estimated-weekly-rent-calculator/result']);
    }
  }
}
