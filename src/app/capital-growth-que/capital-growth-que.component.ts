import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router';
import { DataService } from '../data.service';
import { trigger,state,style,animate,transition } from '@angular/animations';
import {ValidationService} from '../validation.service';
import { environment } from '../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-capital-growth-que',
  templateUrl: './capital-growth-que.component.html',
  styleUrls: ['./capital-growth-que.component.css'],
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
    trigger('cg',[
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
    trigger('FXG',[
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
    trigger('IT',[
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
export class CapitalGrowthQueComponent implements OnInit {
  PropertyLondon:any;
  MapLoad = true;
  lat: number;
  long: number;
  PropertyValue = '';
  capitalgrowth = '';
  investedTenure = '';
  FXGrowthPA='';
  homecurrency='';
  calcData: any;
  homecurrencyText:string=""; 
  constructor(public validation: ValidationService,
              private dataService: DataService,
              private router: Router) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
  }

  ngOnInit(): void {

    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);
    
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
      this.PropertyValue=this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.capitalgrowth)){
      this.capitalgrowth=this.calcData.capitalgrowth+"%";
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
       this.investedTenure =this.calcData.investedTenure;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)){
      this.FXGrowthPA=this.calcData.fxgrowth+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
      this.homecurrencyText=this.calcData.homecurrencyText;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
      this.homecurrency=this.calcData.homecurrency;
    }
//  $(document).ready(function(){
//   $(".percent").on('input', function() {
//       $(this).val(function(i, v) {
//         return v.replace('%','') + '%';  });
//         });
//     });
}
async homecurrencyChange(){
  if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
    this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
    var FinalRate=0;
    let Currpromise = new Promise((res, rej) => {
      this.dataService.GetRequest1('https://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
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
  async next(){
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g,'');
    }else{
      const element = document.getElementById('propertyValue');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.capitalgrowth)){
      this.calcData.capitalgrowth = this.capitalgrowth.replace("%",'');
    }else{
      const element = document.getElementById('capitalgrowth');
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
    if (!this.dataService.EmptyNullOrUndefined(this.FXGrowthPA)){
      this.calcData.fxgrowth = this.FXGrowthPA.replace("%",'');
    }else{
      const element = document.getElementById('FXGrowthPA');
      element.classList.add('error-input');
      flag = false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
      // this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
      // var FinalRate=0;
      // let Currpromise = new Promise((res, rej) => {
      //   this.dataService.GetRequest1('https://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
      //     try {
      //       let res1 = data;
      //       if(res1.success==true){
      //         var GBP_Rate = res1.rates['GBP']
      //         var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
      //         if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
      //           FinalRate= HC_Rate/GBP_Rate;
      //           this.homecurrency=FinalRate.toString();
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
      this.router.navigate(['/capital-growth-calculator/result']);
    }
  }
}
