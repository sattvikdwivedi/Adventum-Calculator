import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
declare var $: any;
import * as Chart from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-predictive-foreign-result',
  templateUrl: './predictive-foreign-result.component.html',
  styleUrls: ['./predictive-foreign-result.component.css']
})
export class PredictiveForeignResultComponent implements OnInit,AfterViewInit {
  Email :any;
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  calcData: any;
  GBPValue = '';
  homeCurrency=0;
  fxGrowth=[];
  yearArray=[];
  calculatedCapitalGrowth: number;
  loadingPrintbtn=false;
  loadingDownloadbtn=false;
  loadingSharebtn=false;
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
  ngAfterViewInit(): void {
    if(!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))){
      this.reportSaveToServer();
    }
    const ctx = $('#canvas')[0].getContext('2d');
      const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
		  gradientStroke.addColorStop(0, '#1d1751');
		  gradientStroke.addColorStop(1, '#f7f7f7');
		  const gradientStroke1 = ctx.createLinearGradient(500, 0, 100, 0);
		  gradientStroke1.addColorStop(0, '#1aaf4b');
      gradientStroke1.addColorStop(1, '#f7f7f7');
      if ($(window).width() > 960) {
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.yearArray,
            datasets: [{
              label: this.calcData.homecurrencyText,
              borderColor: gradientStroke1,
              pointBorderColor: gradientStroke1,
              pointBackgroundColor: gradientStroke1,
              pointHoverBackgroundColor: gradientStroke1,
              pointHoverBorderColor: gradientStroke1,
              pointRadius: 0,
              fill: false,
              borderWidth: 9,
              borderCapStyle: 'round',
              data: this.fxGrowth,
            }]
          },
          options: {
            legend: {
              display: true
            },
            responsive: true,
            title: {
              display: false,
              text: 'Yearly IRR (Internal Rate of Return)'
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Year',
                  fontSize: 9
                },
                ticks: {
                  fontSize: 14,
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Percentage'
                },
                ticks: {
                  fontSize: 9
                }
              }]
            }
          }
        });
      }else{
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.yearArray,
            datasets: [{
              label: 'INR',
              borderColor: gradientStroke1,
              pointBorderColor: gradientStroke1,
              pointBackgroundColor: gradientStroke1,
              pointHoverBackgroundColor: gradientStroke1,
              pointHoverBorderColor: gradientStroke1,
              pointRadius: 0,
              fill: false,
              borderWidth: 3,
              borderCapStyle: 'round',
              data: this.fxGrowth,
            }]
          },
          options: {
            legend: {
              display: true,
              labels:{
                fontSize: 7,
                boxWidth:10
              }
            },
            responsive: true,
            title: {
              display: false,
              text: 'Yearly IRR (Internal Rate of Return)'
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Year',
                  fontSize: 9,
                },
                ticks: {
                  fontSize: 7.5,
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Percentage',
                  fontSize: 8,
                },
                ticks: {
                  fontSize: 8,
                }
              }]
            }
          }
        });
      }
  }

  ngOnInit(): void {
    this.fxGrowth=[];
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    this.GBPValue = this.calcData.InvestmentGBP;
    this.homeCurrency=parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
    for (let i = 0; i < this.calcData.investedTenure; i++) {
      this.homeCurrency=this.homeCurrency+(this.homeCurrency*this.calcData.fxgrowth/100);
      this.fxGrowth.push(this.homeCurrency.toFixed(4));
      this.yearArray.push(i+1);
    }
  }
  startagain(): void {
    this.calcData.reportSavedOnServer=false;
    localStorage.setItem("calcData",JSON.stringify(this.calcData));
    // localStorage.clear();
    this.router.navigate(['/Predictive-Foreign-calculator/question']);
  }

  
  printScreen() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingPrintbtn=true;
      window.print();
      this.loadingPrintbtn=false;
    }
    else {
      this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
    }
  }

  convetToPDF() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingDownloadbtn=true;
      $(".noprint").addClass("displaynone");
      const data = document.getElementById('contentToConvert');
      html2canvas(data,
        {
          scrollY: -window.scrollY,
          logging: true,
          useCORS: true,
          allowTaint: true
        }).then(canvas => {
          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 20, 5, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 20)
          pdf.save('new-file.pdf'); // Generated PDF
          this.loadingDownloadbtn=false;
        });
      $(".noprint").removeClass("displaynone");
      
    }
    else {
      this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
    }
  }
  emailpopup(){
          $("#myModal").modal("show");
        }
   shareReport() {
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share Predictive Foreign Result Result');
      }
    else{
      var multipleUser = this.Email.split(',');
      if(multipleUser.length > 5){
          alert('You cannot share report to more than 5 recipients at a time.')
        }
      else{
          var obj = {};
          var errorresult = "";
          for(var i = 0; i<multipleUser.length;i++){
            if(obj[multipleUser[i]] === undefined ){
               obj[multipleUser[i]] = 1;
            }
            else{
                  errorresult+=multipleUser[i];
                  if(i<multipleUser.length-1)
                  errorresult+=",";
            }
          }
          if(errorresult!==""){
          alert(errorresult + " is repeated");
          }
          else{
      if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        this.loadingSharebtn = true;
        $("#cancelbtn").attr("disabled","true");
        $("#secondMain").addClass("noprint");
        $(".noprint").addClass("displaynone");
         const data = document.getElementById('contentToConvert');
        html2canvas(data,
          {
            scrollY: -window.scrollY,
            logging: true,
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            let contentDataURL = canvas.toDataURL('image/png');
            contentDataURL = contentDataURL.replace("data:image/png;base64,", "");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL,"CalculatorId" : localStorage.getItem('CalculatorText') };
            const Response = this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
              if (response.n === 1) {
                alert(response.Msg);
                this.Email = "";
                $("#myModal").modal("hide");
              } else if (response.n === 0) {
                alert(response.Msg);
              } else {
                alert('Something went wrong please try agian later');
              }
              this.loadingSharebtn = false;
              $("#cancelbtn").removeAttr("disabled");
              $("#secondMain").removeClass("noprint");
            });
          });
           $(".noprint").removeClass("displaynone");
     
       
      }
      else {
        $("#myModal").modal("hide");
        this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
      }
    }
      }
  
    }
 
   
  }
  reportSaveToServer(){
    setTimeout(() => {
      if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        $(".noprint").addClass("displaynone");
        const data = document.getElementById('contentToConvert');
        html2canvas(data,
          {
            scrollY: -window.scrollY,
            logging: true,
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            let contentDataURL = canvas.toDataURL('image/png');
            contentDataURL=contentDataURL.replace("data:image/png;base64,","");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "CalculatorId": localStorage.getItem('CalculatorType').toString(), "ResultImageBase64String": contentDataURL };
            const Response = this.dataService.PostAdventumRequest('v1/saveuserresult', Data).subscribe((response) => {
              this.calcData.reportSavedOnServer=true;
              localStorage.setItem("calcData",JSON.stringify(this.calcData));
            });
          });
          $(".noprint").removeClass("displaynone");
      }
    }, 5000);
    
  }
     cancel(){
      $("#myModal").modal("hide");
      this.Email = "";
    }
}
