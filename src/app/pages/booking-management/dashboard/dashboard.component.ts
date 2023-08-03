import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { map } from 'rxjs';
import { BookingService } from 'src/app/services/module/booking.service';
import { EmployeeService } from 'src/app/services/module/employee.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  title: ApexTitleSubtitle | any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart: any;
  public chartOptions: Partial<ChartOptions>;

  listEmployee: Array<any> = [];
  data: Array<any> = [];
  form: any;

  constructor(
    private employeeService: EmployeeService,
    private bookingService: BookingService,
    private formBuilder: FormBuilder

  ) {
   this.chartOptions = {};
   }

   InitChart(title: any, data: any, date: any, month: any, year: any){
    this.chartOptions = {
      series: [
        {
          name: "Inflation",
          data: data
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: title,
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        }
      },
      title: {
        text: "Statistic Report Of Employees on " + date || month || year || "2023",
        floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
   }

  ngOnInit() {
    this.initForm();
    this.getEmployee();
    this.getStatistic();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: [null],
      month: [null],
      year: [null]
    })
  }

  get f() {
    return this.form.controls
  }

  getEmployee() {
    this.employeeService.getAllEmployee({}).subscribe(res => {
      if(res.errorCode === '0'){
        this.listEmployee = res.data;
        this.listEmployee = this.listEmployee.map(e => e.name);
      }
    })
  }

  getStatistic() {
    this.bookingService.statisticBooking(this.form.value).subscribe(res => {
      if(res.errorCode === '0'){
        this.data = res.data;
        this.data = this.data.map(e => e?.sumService ? e?.sumService : 0);
        this.InitChart(this.listEmployee, this.data, this.f.date?.value, this.f.month?.value, this.f.year?.value);

      }
    })
  }

  filter() {
    this.getStatistic();
  }

  refresh() {
    this.initForm();
    this.getStatistic();
  }
}
