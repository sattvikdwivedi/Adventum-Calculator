import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
declare var $: any;
import { trigger,state,style,animate,transition } from '@angular/animations';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-predictive-foreign-que',
  templateUrl: './predictive-foreign-que.component.html',
  styleUrls: ['./predictive-foreign-que.component.css'],
  animations: [
    trigger('InvestGBP',[
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
    trigger('PreHC',[
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
    ])   ]
})
export class PredictiveForeignQueComponent implements OnInit {
  PropertyLondon:any;
  calcData: any;
  InvestmentGBP = ''; 
  FXGrowth = '';
  PreHomeCurrency = '';     
  investedTenure='';
  MapLoad=true;
  lat :number=0;
  long :number=0;
  homecurrency='';                                                                                                    
  constructor(public validation: ValidationService,
    private dataService: DataService,
    private router: Router) {
this.calcData = JSON.parse(localStorage.getItem('calcData'));
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
        this.lat=this.calcData.lat; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
        this.long=this.calcData.long; 
      } 
    }

  ngOnInit(): void {

    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.InvestmentGBP)){
       this.InvestmentGBP=this.validation.amountWithComma(this.calcData.InvestmentGBP);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
      this.PreHomeCurrency=this.calcData.homecurrencyText;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)){
       this.FXGrowth=this.calcData.fxgrowth+"%";
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
      this.investedTenure =this.calcData.investedTenure;
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
    if(!this.dataService.EmptyNullOrUndefined(this.PreHomeCurrency)){
      this.calcData.homecurrencyText=this.PreHomeCurrency.toUpperCase();
      var FinalRate=0;
      let Currpromise = new Promise((res, rej) => {
        this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
          try {
            let res1 = data;
            if(res1.success==true){
              var GBP_Rate = res1.rates['GBP']
              var HC_Rate = res1.rates[this.PreHomeCurrency.toUpperCase()]
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
  async next(): Promise<void>{
    let flag = true;
    
    if (!this.dataService.EmptyNullOrUndefined(this.InvestmentGBP)){
      this.calcData.InvestmentGBP = this.InvestmentGBP.replace(/,/g,'');
    }else{
      const element = document.getElementById('InvestmentGBP');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.PreHomeCurrency)){
      // this.calcData.homecurrencyText = this.PreHomeCurrency.toUpperCase();
      // var FinalRate=0;
      // let Currpromise = new Promise((res, rej) => {
      //   this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
      //     try {
      //       let res1 = data;
      //       if(res1.success==true){
      //         var GBP_Rate = res1.rates['GBP']
      //         var HC_Rate = res1.rates[this.PreHomeCurrency.toUpperCase()]
      //         if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
      //           FinalRate= HC_Rate/GBP_Rate;
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
      const element = document.getElementById('PreHomeCurrency');
      element.classList.add('error-input');
      flag = false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrency)){
      this.calcData.homecurrency=this.homecurrency;
    }else{
      let element=document.getElementById("homecurrencyvalue");
      element.classList.add("error-input");
      flag=false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.FXGrowth)){
      this.calcData.fxgrowth = this.FXGrowth.replace("%",'');
    }else{
      const element = document.getElementById('FXGrowth');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.investedTenure)){
      this.calcData.investedTenure = this.investedTenure
    }else{
      const element = document.getElementById('investedTenure');
      element.classList.add('error-input');
      flag = false;
    }
    if (flag){
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/predictive-foreign-calculator/result']);
    }
  }
}
