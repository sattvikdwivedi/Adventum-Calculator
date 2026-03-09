import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DataService } from '../data.service';
import {ValidationService} from '../validation.service';
declare var $: any;
import * as Chart from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-capital-growth-result',
  templateUrl: './capital-growth-result.component.html',
  styleUrls: ['./capital-growth-result.component.css']
})
export class CapitalGrowthResultComponent implements OnInit,AfterViewInit {
  Email:any;
  calculatedCapitalGrowth: number;
  calculatedCapitalGrowtharray:any=[];
  MapLoad = true;
  lat :number=0;
  long :number=0;
  calcData: any;
  GBPValue:number=0;
  investedTenure='';
  CaptitalGrowthinHomeCurrency:number=0;
  CaptitalGrowthinHomeCurrencyArray:any=[];
  homeCurrencyFXGrowth=0;
  propertyValue=0;
  propertyValueHomeCurrency=0;
  yearArray=[];
  loadingPrintbtn=false;
  loadingDownloadbtn=false;
  loadingSharebtn=false;
  constructor(private router: Router,
              private dataService: DataService,public validation: ValidationService) { }

  ngOnInit(): void {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
	this.GBPValue=this.calcData.PropertyValue;
  this.propertyValue=this.calcData.PropertyValue;
	this.homeCurrencyFXGrowth=parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
  this.propertyValueHomeCurrency=this.propertyValue*this.homeCurrencyFXGrowth;
	this.investedTenure=this.calcData.investedTenure;
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    this.calculatedCapitalGrowth = parseInt(this.calcData.PropertyValue);
    for (let i = 0; i < parseInt(this.calcData.investedTenure); i++){
      this.calculatedCapitalGrowth += parseFloat((this.calculatedCapitalGrowth * parseInt(this.calcData.capitalgrowth) / 100).toFixed(4));
      this.calculatedCapitalGrowtharray.push(parseFloat((((this.calculatedCapitalGrowth-this.propertyValue)/this.propertyValue)*100).toFixed(4)));
      this.homeCurrencyFXGrowth=parseFloat((this.homeCurrencyFXGrowth+(this.homeCurrencyFXGrowth*parseFloat(this.calcData.fxgrowth)/100)).toFixed(4));
      this.CaptitalGrowthinHomeCurrencyArray.push(parseFloat(((((this.calculatedCapitalGrowth*this.homeCurrencyFXGrowth)-this.propertyValueHomeCurrency)/this.propertyValueHomeCurrency)*100).toFixed(4)));
      this.CaptitalGrowthinHomeCurrency=parseFloat((this.calculatedCapitalGrowth*this.homeCurrencyFXGrowth).toFixed(4));
      this.yearArray.push(i+1);
    }
    this.yearArray.push(this.yearArray.length+1);
  }
  ngAfterViewInit(): void {
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
              label: 'GBP',
              borderColor: gradientStroke,
              pointBorderColor: gradientStroke,
              pointBackgroundColor: gradientStroke,
              pointHoverBackgroundColor: gradientStroke,
              pointHoverBorderColor: gradientStroke,
              pointRadius: 0,
              fill: false,
              borderWidth: 9,
              borderCapStyle: 'round',
              data: this.calculatedCapitalGrowtharray,
            }, {
              label: 'INR',
              borderColor: gradientStroke1,
              pointBorderColor: gradientStroke1,
              pointBackgroundColor: gradientStroke1,
              pointHoverBackgroundColor: gradientStroke1,
              pointHoverBorderColor: gradientStroke1,
              pointRadius: 0,
              fill: false,
              borderWidth: 9,
              borderCapStyle: 'round',
              data: this.CaptitalGrowthinHomeCurrencyArray,
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
              label: 'GBP',
              borderColor: gradientStroke,
              pointBorderColor: gradientStroke,
              pointBackgroundColor: gradientStroke,
              pointHoverBackgroundColor: gradientStroke,
              pointHoverBorderColor: gradientStroke,
              pointRadius: 0,
              fill: false,
              borderWidth: 3,
              borderCapStyle: 'round',
              data: this.calculatedCapitalGrowtharray,
            }, {
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
              data: this.CaptitalGrowthinHomeCurrencyArray,
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
     
    


	  // const ctx2 = $('#canvas2')[0].getContext('2d');
    //   const gradientStroke2 = ctx2.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke2.addColorStop(0, '#1d1751');
		//   gradientStroke2.addColorStop(1, '#f7f7f7');
		//   const gradientStroke3 = ctx2.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke3.addColorStop(0, '#1aaf4b');
    //   gradientStroke3.addColorStop(1, '#f7f7f7');
    //   var myChart = new Chart(ctx2, {
    //     type: 'line',
    //     data: {
    //       labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    //       datasets: [{
    //         label: 'GBP',
    //         borderColor: gradientStroke,
    //         pointBorderColor: gradientStroke,
    //         pointBackgroundColor: gradientStroke,
    //         pointHoverBackgroundColor: gradientStroke,
    //         pointHoverBorderColor: gradientStroke,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [
		// 		9,
		// 		9,
		// 		11,
		// 		13,
		// 		13,
		// 		13,
		// 		12,
		// 		12,
		// 		12,
		// 		13

		//    /*randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor()*/
		//    ],
    //       }, {
    //         label: 'INR ($)',
    //         borderColor: gradientStroke1,
    //         pointBorderColor: gradientStroke1,
    //         pointBackgroundColor: gradientStroke1,
    //         pointHoverBackgroundColor: gradientStroke1,
    //         pointHoverBorderColor: gradientStroke1,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [
		// 		3,
		// 		3,
		// 		5,
		// 		5,
		// 		5,
		// 		6,
		// 		6,
		// 		8,
		// 		8,
		// 		8


		// 		],

    //       }]
    //     },
    //     options: {
    //       legend: {
    //         display: true
    //       },
    //       responsive: true,
    //       title: {
    //         display: false,
    //         text: 'Yearly IRR (Internal Rate of Return)'
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true,
    //           scaleLabel: {
    //             display: true,
    //             labelString: 'Year'
    //           },
    //         }],
    //         yAxes: [{
    //           display: true,
    //           scaleLabel: {
    //           display: true,
    //           labelString: 'Percentage'
    //         }
    //         }]
    //       }
    //     }
    //   });
    // Donut chart for return breakdown
    const ctxDonut = $('#can')[0].getContext('2d');
    const capitalGrowthPct = this.calculatedCapitalGrowtharray[this.calculatedCapitalGrowtharray.length - 1] || 0;
    const fxGrowthPct = this.CaptitalGrowthinHomeCurrencyArray[this.CaptitalGrowthinHomeCurrencyArray.length - 1] - capitalGrowthPct;
    new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: ['Capital Growth', 'FX Appreciation'],
        datasets: [{
          data: [Math.max(capitalGrowthPct, 0), Math.max(fxGrowthPct, 0)],
          backgroundColor: ['#4f6ef7', '#22c55e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        legend: { display: false },
        cutoutPercentage: 65
      }
    });

    if(!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))){
      this.reportSaveToServer();
    }

}
  startagain(): void{
    this.calcData.reportSavedOnServer=false;
    localStorage.setItem("calcData",JSON.stringify(this.calcData));
    // localStorage.clear();
    this.router.navigate(['/capital-growth-calculator/question']);
  }

  
  printScreen() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingPrintbtn=true;
      window.print();
      this.loadingPrintbtn=false;
    }
    else {
      this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
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
      this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
    }
  }

  emailpopup(){
    $("#myModal").modal("show");
  }

  shareReport() {
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share Capital Growth Result');
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
        this.loadingSharebtn=true;
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
            contentDataURL=contentDataURL.replace("data:image/png;base64,","");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL,"CalculatorId" : localStorage.getItem('CalculatorText') };
            const Response = this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
              if (response.n === 1){
                alert(response.Msg);
                this.Email = "";
                $("#myModal").modal("hide");
              }else if (response.n === 0){
                alert(response.Msg);
              }else{
                alert('Something went wrong please try agian later');
              }
              this.loadingSharebtn=false;
              $("#cancelbtn").removeAttr("disabled");
              $("#secondMain").removeClass("noprint");
            });
          });
          $(".noprint").removeClass("displaynone");
      }
      else {
        $("#myModal").modal("hide");
        this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
    
      }
    }
     }
 
    }
 
    
  }
  cancel(){
    $("#myModal").modal("hide");
    this.Email = "";
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
}
