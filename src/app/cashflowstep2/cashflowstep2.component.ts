import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { trigger,state,style,animate,transition } from '@angular/animations';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-cashflowstep2',
  templateUrl: './cashflowstep2.component.html',
  styleUrls: ['./cashflowstep2.component.css'],
  animations: [
    trigger('otpmort',[
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
    ])
  ]
})
export class Cashflowstep2Component implements OnInit {
  percentInput: ElementRef;
  PropertyValue:string="";
  optmortgage:string="";
  mortgageType:string="1";
  loanAmount:string="";
  mortgageInterestRate:string="";
  mortgageTenure:string="";
  calcData:any;
  MapLoad=true;
  
  lat :number;
  long :number;

  constructor(
    private router:Router,
    private dataService: DataService,
    public validation:ValidationService) {
    this.calcData=JSON.parse(localStorage.getItem("calcData"));
   
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
      this.PropertyValue=this.validation.amountWithComma(this.calcData.PropertyValue);
    }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.optmortgage)){
    this.optmortgage=this.calcData.optmortgage;
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageType)){
    this.mortgageType=this.calcData.mortgageType; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.loanAmount)){
    this.loanAmount=this.calcData.loanAmount; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageInterestRate)){
    this.mortgageInterestRate=this.calcData.mortgageInterestRate+"%"; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageTenure)){
    this.mortgageTenure=this.calcData.mortgageTenure; 
  } 
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
    this.lat=this.calcData.lat; 
  } 
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
    this.long=this.calcData.long; 
  } 
 
}
  ngOnInit(): void {
  // $(document).ready(function(){
  //   $(".percent").on('input', function() {
  //     $(this).val(function(i, v) {
  //      return v.replace('%','') + '%';  });
  //   });
  // });
  }

  next(){
    let flag=true;
    if(!this.dataService.EmptyNullOrUndefined(this.optmortgage)){
        this.calcData.optmortgage=this.optmortgage;
        if(!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
          this.calcData.PropertyValue=this.PropertyValue.replace(/,/g,'');
        }else{
          let element=document.getElementById("propertyValue");
          element.classList.add("error-input");
          flag=false;
        }
        if(this.optmortgage=="1"){
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageType)){
            this.calcData.mortgageType=this.mortgageType;
          }else{
            let element=document.getElementById("mortgageType");
            element.classList.add("error-input");
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.loanAmount)){
            this.calcData.loanAmount=this.loanAmount.replace("%",'');
          }else{
            let element=document.getElementById("loanAmount");
            element.classList.add("error-input");
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageInterestRate)){
            this.calcData.mortgageInterestRate=this.mortgageInterestRate.replace("%",'');;
          }else{
            let element=document.getElementById("mortgageInterestRate");
            element.classList.add("error-input");
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageTenure)){
            this.calcData.mortgageTenure=this.mortgageTenure;
          }else{
            let element=document.getElementById("mortgageTenure");
            element.classList.add("error-input");
            flag=false;
          }
        }
      }else{
        let element=document.getElementById("optmortgage");
        element.classList.add("error-input");
        flag=false;
      }
    
   if(flag){
    this.calcData.reportSavedOnServer=false;
    localStorage.setItem("calcData",JSON.stringify(this.calcData));
    this.router.navigate(['/cashflow/step3']);
   }
  }

}
