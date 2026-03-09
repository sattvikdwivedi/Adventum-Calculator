import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger,state,style,animate,transition } from '@angular/animations';
import { ValidationService } from '../validation.service'
import{Router} from '@angular/router';
import { environment } from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-cashflowstep4',
  templateUrl: './cashflowstep4.component.html',
  styleUrls: ['./cashflowstep4.component.css'],
  animations: [
    trigger('afsfirst',[
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
    trigger('assfirst',[
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
        transition('* => visible', [animate('1.5s ease-out')])
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
        transition('* => visible', [animate('2s ease-out')])
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
        transition('* => visible', [animate('2.5s ease-out')])
    ])
  ]
})
export class Cashflowstep4Component implements OnInit {
  foreignbuyer:string="";
  stampDutyLandTax:string="";
  loanOriginationFee:string="";
  calcData:any;
  MapLoad=true;
  lat :number=0;
  long :number=0;
  country:string="";
  PropertyValue:string="";
  letteingManagFee:string="";
  groundRent:string="";
  serviceCharges:string="";
  miscelleneousExpense:string="";
  PropertyLondon:any;

  constructor(private router:Router,
    private dataService: DataService,
    public validation:ValidationService) {
      this.calcData=JSON.parse(localStorage.getItem("calcData"));
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.foreignbuyer)){
        this.foreignbuyer = this.calcData.foreignbuyer;
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.stampDutyLandTax)){
        this.stampDutyLandTax=this.validation.amountWithComma(this.calcData.stampDutyLandTax);
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee)){
        this.loanOriginationFee=this.calcData.loanOriginationFee+"%";
      }
      if(this.calcData.optmortgage=="0"){
        this.loanOriginationFee="0"+"%";
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
        this.lat=this.calcData.lat; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
        this.long=this.calcData.long; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.Country)){
        this.country=this.calcData.Country; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
        this.PropertyValue=this.calcData.PropertyValue; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)){
        this.letteingManagFee=this.calcData.letteingManagFee+"%";
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.groundRent)){
        this.groundRent=this.validation.amountWithComma(this.calcData.groundRent);
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges)){
        this.serviceCharges=this.validation.amountWithComma(this.calcData.serviceCharges);
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense)){
        this.miscelleneousExpense=this.validation.amountWithComma(this.calcData.miscelleneousExpense);
      }
     }
  ngOnInit(): void {

    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);
      // this.dataService.GetRequest('https://api.propertydata.co.uk/stamp-duty-calculator?key='+environment.PropertyDataKey+'&value='+this.PropertyValue+'&country='+this.country+'&mode=investment').subscribe(
      //   (res: Response) => 
      //     {
      //     var obj = JSON.parse(JSON.stringify(res));
      //      if(obj.status=="success"){
      //        this.stampDutyLandTax=this.validation.amountWithComma(obj.transaction_tax_payable.toString());
      //        
      //      }
      //     }
      // );
      // $(document).ready(function(){
      //   $(".percent").on('input', function() {
      //     $(this).val(function(i, v) {
      //      return v.replace('%','') + '%';  });
      //   });
      // });
  }
  next(){
    let flag=true;
    if(!this.dataService.EmptyNullOrUndefined(this.foreignbuyer)){
      this.calcData.foreignbuyer = this.foreignbuyer;
    }else{
      let element=document.getElementById("foreignbuyer");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.stampDutyLandTax)){
      this.calcData.stampDutyLandTax=this.stampDutyLandTax.replace(/,/g,'');
    }else{
      let element=document.getElementById("stampDutyLandTax");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.loanOriginationFee)){
      this.calcData.loanOriginationFee=this.loanOriginationFee.replace("%",'');
    }
    //else{
    //   let element=document.getElementById("loanOriginationFee");
    //   element.classList.add("error-input");
    //   flag=false;
    // }
    if(!this.dataService.EmptyNullOrUndefined(this.letteingManagFee)){
      this.calcData.letteingManagFee=this.letteingManagFee.replace("%",'');
    }else{
      let element=document.getElementById("letteingManagFee");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.groundRent)){
      this.calcData.groundRent=this.groundRent.replace(/,/g,'');
    }
    
    if(!this.dataService.EmptyNullOrUndefined(this.serviceCharges)){
      this.calcData.serviceCharges=this.serviceCharges.replace(/,/g,'');
    }
   
    if(!this.dataService.EmptyNullOrUndefined(this.miscelleneousExpense)){
      this.calcData.miscelleneousExpense=this.miscelleneousExpense.replace(/,/g,'');
    }
    if(flag){
      // localStorage.setItem("calcData",JSON.stringify(this.calcData));
      // this.router.navigate(['/step5']);
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem("calcData",JSON.stringify(this.calcData));
      this.router.navigate(['/cashflow/result'])
    }
  }

  calculatestampduty(){
    if(this.foreignbuyer != ''){
      this.dataService.GetRequest('https://api.propertydata.co.uk/stamp-duty-calculator?key='+environment.PropertyDataKey+'&value='+this.PropertyValue+'&country='+this.country+'&mode=investment').subscribe(
        (res: Response) => 
          {
          var obj = JSON.parse(JSON.stringify(res));
           if(obj.status=="success" && this.foreignbuyer == "1"){
             this.stampDutyLandTax = (obj.transaction_tax_payable + (this.calcData.PropertyValue * 2/100))
             this.stampDutyLandTax=this.validation.amountWithComma( this.stampDutyLandTax .toString());
           }
           else{
            this.stampDutyLandTax=this.validation.amountWithComma(obj.transaction_tax_payable.toString());
           }
          }
      );
    }

  }

}
