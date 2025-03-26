// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
// import { HistoryService } from '../../services/history.service';
// import { History } from '../../interfaces/history';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-chart',
//   standalone: true,
//   imports: [NgxEchartsModule, CommonModule, HttpClientModule],
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.css'],
//   providers: [
//     {
//       provide: NGX_ECHARTS_CONFIG,
//       useFactory: () => ({ echarts: () => import('echarts') }),
//     },
//   ],
// })
// export class ChartComponent implements OnInit {
//   lineChartOptions: any;
//   candlestickChartOptions: any;

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private historyService: HistoryService
//   ) {}

//   ngOnInit() {
//     const stockId = this.route.snapshot.paramMap.get('stock_id');
//     if (stockId) {
//       this.fetchHistory(stockId);
//     }
//   }

//   fetchHistory(stockId: string) {
//     this.http.get<History>(`http://localhost:9999/history/${stockId}`).subscribe({
//       next: (data) => {
  
//         this.historyService.setHistory(data);
//         if (data.history) {
//           this.prepareCharts(data.history);
//         }
//       },
//       error: (error) => console.error('Error fetching history:', error),
//     });
//   }

//   prepareCharts(historyData: Record<string, number>) {
//     const dates = Object.keys(historyData);
//     const prices = Object.values(historyData);

//     // Line Chart Configuration
//     this.lineChartOptions = {
//       xAxis: {
//         type: 'category',
//         data: dates,
//       },
//       yAxis: {
//         type: 'value',
//       },
//       series: [
//         {
//           data: prices,
//           type: 'line',
//         },
//       ],
//     };

//     // Candlestick Chart Configuration
//     this.candlestickChartOptions = {
//       xAxis: {
//         type: 'category',
//         data: dates,
//       },
//       yAxis: {
//         type: 'value',
//       },
//       series: [
//         {
//           type: 'candlestick',
//           data: this.formatCandlestickData(prices),
//         },
//       ],
//     };
//   }

//   formatCandlestickData(prices: number[]): number[][] {
//     // Placeholder: Convert prices to candlestick format [open, close, low, high]
//     return prices.map((price) => [price, price, price, price]);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { HistoryService } from '../../services/history.service';
import { History } from '../../interfaces/history';
import { CommonModule } from '@angular/common';

type Timeframe = 'year' | 'month' | 'day' | 'hour' | 'minute';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, HttpClientModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
})
export class ChartComponent implements OnInit {
  lineChartOptions: any;
  candlestickChartOptions: any;

  // Allow selection of different timeframes.
  selectedTimeframe: Timeframe = 'hour';

  // Raw history data from the API.
  rawHistoryData: Record<string, number> = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    const stockId = this.route.snapshot.paramMap.get('stock_id');
    if (stockId) {
      this.fetchHistory(stockId);
    }
  }

  fetchHistory(stockId: string): void {
    this.http.get<History>(`http://localhost:9999/history/${stockId}`).subscribe({
      next: (data) => {
        this.historyService.setHistory(data);
        if (data.history) {
          this.rawHistoryData = data.history;
          this.prepareCharts(this.rawHistoryData, this.selectedTimeframe);
        }
      },
      error: (error) => console.error('Error fetching history:', error),
    });
  }

  // Call this when the user changes the timeframe filter.
  changeTimeframe(event: Event): void {
    const timeframe = (event.target as HTMLSelectElement).value as Timeframe;
    this.selectedTimeframe = timeframe;
    this.prepareCharts(this.rawHistoryData, this.selectedTimeframe);
  }

  /**
   * Group the raw history data based on the selected timeframe.
   * Returns the grouped keys (dates), the last price for line chart,
   * and OHLC values for the candlestick chart.
   */
  private groupData(
    historyData: Record<string, number>,
    timeframe: Timeframe
  ): { dates: string[]; linePrices: number[]; candlestickData: number[][] } {
    const groups: { [key: string]: number[] } = {};

    // Sort the entries chronologically.
    const sortedEntries = Object.entries(historyData).sort(
      ([t1], [t2]) => new Date(t1).getTime() - new Date(t2).getTime()
    );

    sortedEntries.forEach(([timestamp, price]) => {
      const date = new Date(timestamp);
      let key: string;

      // Generate grouping key based on the timeframe.
      switch (timeframe) {
        case 'year':
          key = `${date.getFullYear()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          break;
        case 'hour':
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:00`;
          break;
        case 'minute':
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          break;
        default:
          key = timestamp; // fallback to the raw timestamp if no filter is provided.
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(price);
    });

    // Order the groups chronologically.
    const dates = Object.keys(groups).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const linePrices: number[] = [];
    const candlestickData: number[][] = [];

    dates.forEach((dateKey) => {
      const prices = groups[dateKey];
      // For line chart, use the last price in the group.
      linePrices.push(prices[prices.length - 1]);
      // For candlestick: open (first), close (last), low (min), high (max).
      const open = prices[0];
      const close = prices[prices.length - 1];
      const high = Math.max(...prices);
      const low = Math.min(...prices);
      candlestickData.push([open, close, low, high]);
    });

    return { dates, linePrices, candlestickData };
  }

  // prepareCharts(historyData: Record<string, number>, timeframe: Timeframe): void {
  //   const { dates, linePrices, candlestickData } = this.groupData(historyData, timeframe);

  //   // Configure the line chart with data zoom enabled.
  //   this.lineChartOptions = {
  //     title: {
  //       text: `Stock Price (Line Chart) - Grouped by ${timeframe}`,
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //     },
  //     dataZoom: [
  //       {
  //         type: 'inside',
  //         xAxisIndex: [0],
  //         start: 0,
  //         end: 100,
  //       },
  //       {
  //         type: 'slider',
  //         xAxisIndex: [0],
  //         start: 0,
  //         end: 100,
  //       },
  //     ],
  //     xAxis: {
  //       type: 'category',
  //       data: dates,
  //     },
  //     yAxis: {
  //       type: 'value',
  //     },
  //     series: [
  //       {
  //         data: linePrices,
  //         type: 'line',
  //         smooth: true,
  //       },
  //     ],
  //   };

  //   // Configure the candlestick chart with data zoom enabled.
  //   this.candlestickChartOptions = {
  //     title: {
  //       text: `Stock Candlestick Chart - Grouped by ${timeframe}`,
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //     },
  //     dataZoom: [
  //       {
  //         type: 'inside',
  //         xAxisIndex: [0],
  //         start: 0,
  //         end: 100,
  //       },
  //       {
  //         type: 'slider',
  //         xAxisIndex: [0],
  //         start: 0,
  //         end: 100,
  //       },
  //     ],
  //     xAxis: {
  //       type: 'category',
  //       data: dates,
  //       boundaryGap: true,
  //     },
  //     yAxis: {
  //       type: 'value',
  //     },
  //     series: [
  //       {
  //         type: 'candlestick',
  //         data: candlestickData,
  //         itemStyle: {
  //           color: '#0CF49B',
  //           color0: '#FD1050',
  //           borderColor: '#0CF49B',
  //           borderColor0: '#FD1050',
  //         },
  //       },
  //     ],
  //   };
  // }
  prepareCharts(historyData: Record<string, number>, timeframe: Timeframe): void {
    const { dates, linePrices, candlestickData } = this.groupData(historyData, timeframe);
  
    // Configure the line chart with data zoom enabled and adjusted yAxis settings.
    this.lineChartOptions = {
      title: {
        text: `Stock Price (Line Chart) - Grouped by ${timeframe}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
        // Adjust the minInterval or splitNumber to reduce the gap on the y-axis.
        minInterval: 0.01, // Set to a smaller value to better match your data precision.
        splitNumber: 5,    // Adjust number of splits if needed.
      },
      series: [
        {
          data: linePrices,
          type: 'line',
          smooth: true,
        },
      ],
    };
  
    // Configure the candlestick chart with data zoom enabled and adjusted yAxis settings.
    this.candlestickChartOptions = {
      title: {
        text: `Stock Candlestick Chart - Grouped by ${timeframe}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: true,
      },
      yAxis: {
        type: 'value',
        minInterval: 0.01,
        splitNumber: 5,
        // You can also set min and max if you know the range of your data.
        min: 11,
        max: 14,
      },
      series: [
        {
          type: 'candlestick',
          data: candlestickData,
          itemStyle: {
            color: '#0CF49B',
            color0: '#FD1050',
            borderColor: '#0CF49B',
            borderColor0: '#FD1050',
          },
        },
      ],
    };
  }
  
}
