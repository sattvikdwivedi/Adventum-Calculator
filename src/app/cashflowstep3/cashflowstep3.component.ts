import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router';
import { DataService } from '../data.service';
import { trigger,state,style,animate,transition } from '@angular/animations';
import {ValidationService} from '../validation.service';
import { environment } from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-cashflowstep3',
  templateUrl: './cashflowstep3.component.html',
  styleUrls: ['./cashflowstep3.component.css'],
  animations: [
    trigger('affirst',[
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
    trigger('asfirst',[
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
    trigger('atfirst',[
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
    trigger('afrfirst',[
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
    trigger('aftfirst',[
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
    ])
  ]
})
export class Cashflowstep3Component implements OnInit {

  homecurrencyText:string="";
  homecurrency:string="";
  investedTenure:string="";
  rentalYeild:string="";
  rentalGrowthEscalation:string="";
  capitalgrowth:string="";
  fxgrowth:string="";
  calcData:any;
  MapLoad=true;
  lat :number=0;
  long :number=0;
  PropertyLondon:any;

  constructor(
    
    private router:Router,
    private dataService: DataService,
    public validation:ValidationService)
  { 
    this.calcData=JSON.parse(localStorage.getItem("calcData"));
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.optmortgage)){
      if(this.calcData.optmortgage=="1"){
        if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
          this.investedTenure=this.calcData.mortgageTenure;
        }else{
          if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageTenure))
            this.investedTenure=this.calcData.mortgageTenure;
        }
      }else if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
        this.investedTenure=this.calcData.investedTenure;
      }
    }else if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
      this.investedTenure=this.calcData.investedTenure;
    }
    // if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
    //   this.homecurrency=this.calcData.homecurrency;
    // }
    // if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
    //   this.homecurrencyText=this.calcData.homecurrencyText;
    // }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)){
      this.rentalYeild=this.calcData.rentalYeild+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.rentalGrowthEscalation)){
      this.rentalGrowthEscalation=this.calcData.rentalGrowthEscalation+"%";
    }
    // if(!this.dataService.EmptyNullOrUndefined(this.calcData.capitalgrowth)){
    //   this.capitalgrowth=this.calcData.capitalgrowth+"%";
    // }
    // if(!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)){
    //   this.fxgrowth=this.calcData.fxgrowth+"%";
    // }
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
    // $(document).ready(function(){
    //   $(".percent").on('input', function() {
    //     $(this).val(function(i, v) {
    //      return v.replace('%','') + '%';  });
    //   });
    // });
   }
  //  async homecurrencyChange(){
  //   if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
  //     this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
  //     var FinalRate=0;
  //     let Currpromise = new Promise((res, rej) => {
  //       this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
  //         try {
  //           let res1 = data;
  //           if(res1.success==true){
  //             var GBP_Rate = res1.rates['GBP']
  //             var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
  //             if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
  //               FinalRate= parseFloat((HC_Rate/GBP_Rate).toFixed(2));
  //               this.homecurrency=FinalRate.toString();
  //               this.calcData.homecurrency=this.homecurrency;
  //             }
  //           }
  //           res(res1);
  //         }
  //         catch (ex) {
  //           rej(false);
  //         }
  //       })
  //     });
  //     await Currpromise;
  //   }
  //  }
 async next(){
    let flag=true;
    // if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
    //   this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
    //   var FinalRate=0;
    //   let Currpromise = new Promise((res, rej) => {
    //     this.dataService.GetRequest1('http://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
    //       try {
    //         let res1 = data;
    //         if(res1.success==true){
    //           var GBP_Rate = res1.rates['GBP']
    //           var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
    //           if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
    //             FinalRate= HC_Rate/GBP_Rate;
    //             this.homecurrency=FinalRate.toString(2);
    //             alert( this.homecurrency);
    //             this.calcData.homecurrency=FinalRate;
    //           }
    //         }
    //         res(res1);
    //       }
    //       catch (ex) {
    //         rej(false);
    //       }
    //     })
    //   });
    //   await Currpromise;
    // }else{
    //   let element=document.getElementById("homecurrencyText");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    // if(this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
    //   let element=document.getElementById("homecurrencyText");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    // if(!this.dataService.EmptyNullOrUndefined(this.homecurrency)){
    //   this.calcData.homecurrency=this.homecurrency;
    // }else{
    //   let element=document.getElementById("homecurrencyvalue");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    if(!this.dataService.EmptyNullOrUndefined(this.investedTenure)){
      this.calcData.investedTenure=this.investedTenure
    }else{
      let element=document.getElementById("investedTenure");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.rentalYeild)){
      this.calcData.rentalYeild=this.rentalYeild.replace("%",'');
    }else{
      let element=document.getElementById("rentalYeild");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.rentalGrowthEscalation)){
      this.calcData.rentalGrowthEscalation=this.rentalGrowthEscalation.replace("%",'');
    }else{
      let element=document.getElementById("rentalGrowthEscalation");
      element.classList.add("error-input");
      flag=false;
    }
    // if(!this.dataService.EmptyNullOrUndefined(this.capitalgrowth)){
    //   this.calcData.capitalgrowth=this.capitalgrowth.replace("%",'');
    // }else{
    //   let element=document.getElementById("capitalgrowth");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    // if(!this.dataService.EmptyNullOrUndefined(this.fxgrowth)){
    //   this.calcData.fxgrowth=this.fxgrowth.replace("%",'');
    // }else{
    //   let element=document.getElementById("fxgrowth");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    if(flag)
    {
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem("calcData",JSON.stringify(this.calcData));
      this.router.navigate(['/cashflow/step4']);
    }
  }

}
