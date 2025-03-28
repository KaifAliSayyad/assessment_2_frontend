import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { HistoryService } from '../../services/history.service';
import { History } from '../../interfaces/history';
import { CommonModule } from '@angular/common';
import SockJS from 'sockjs-client';
import { Client, IMessage, IStompSocket } from '@stomp/stompjs';

type Timeframe = 'year' | 'month' | 'day' | 'hour' | 'minute';

// Add this interface to match your HistoryDTO structure
interface HistoryUpdate {
  stockId: number;
  date: Date;
  price: number;
}

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
export class ChartComponent implements OnInit, OnDestroy {
  private stompClient: Client;
  private stockId: string | null = null;
  
  lineChartOptions: any;
  candlestickChartOptions: any;
  selectedTimeframe: Timeframe = 'minute';
  rawHistoryData: Record<string, number> = {};
  minPrice: number = 0;
  maxPrice: number = 100;
  name: string = 'Unknown';
  low: number = 0;
  high: number = 100;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private historyService: HistoryService
  ) {
    this.stompClient = new Client();
  }

  ngOnInit(): void {
    this.stockId = this.route.snapshot.paramMap.get('stock_id');
    if (this.stockId) {
      this.fetchHistory(this.stockId);
      this.initializeWebSocket();
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  private initializeWebSocket(): void {
    this.stompClient.webSocketFactory = () => {
      return new SockJS('http://localhost:8084/ws-stocks') as unknown as IStompSocket;
    };

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket Connected');

      // Subscribe to general stock updates
      this.stompClient.subscribe('/topic/stock-updates', (message: IMessage) => {
        const update = JSON.parse(message.body);
        console.log('Received stock update:', update);
        // Handle general stock updates if needed
      });

      // Subscribe to specific stock history updates
      if (this.stockId) {
        this.stompClient.subscribe(`/topic/history/${this.stockId}`, (message: IMessage) => {
          const historyUpdate = JSON.parse(message.body);
          console.log('Received history update:', historyUpdate);
          
          // Update the component's data with new history
          if (historyUpdate.history) {
            this.rawHistoryData = historyUpdate.history;
            this.minPrice = historyUpdate.minPrice;
            this.maxPrice = historyUpdate.maxPrice;
            this.name = historyUpdate.name;
            // Refresh the charts with new data
            this.prepareCharts(this.rawHistoryData, this.selectedTimeframe);
          }
        });
      }
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket connection error:', frame);
    };

    // Activate the client
    this.stompClient.activate();
  }

  fetchHistory(stockId: string): void {
    this.http.get<History>(`http://localhost:9999/history/${stockId}`).subscribe({
      next: (data) => {
        this.historyService.setHistory(data);
        if (data.history) {
          this.rawHistoryData = data.history;
          this.minPrice = data.minPrice;
          this.maxPrice = data.maxPrice;
          this.name = data.name;
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
      this.high = high;
      this.low = low;
      candlestickData.push([open, close, low, high]);
    });

    return { dates, linePrices, candlestickData };
  }

  prepareCharts(historyData: Record<string, number>, timeframe: Timeframe): void {
    const { dates, linePrices, candlestickData } = this.groupData(historyData, timeframe);
    
    // Calculate the zoom start and end percentages based on high and low values for y-axis
    const totalRange = this.maxPrice - this.minPrice;
    const yZoomStart = ((this.low - 1 - this.minPrice) / totalRange) * 100;
    const yZoomEnd = ((this.high + 1 - this.minPrice) / totalRange) * 100;
  
    // Configure the line chart
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
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: yZoomStart,
          end: yZoomEnd,
        },
        {
          type: 'slider',
          xAxisIndex: [0],
          bottom: '2%',
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          start: yZoomStart,
          end: yZoomEnd,
          right: '2%',
          orient: 'vertical',
        }
      ],
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
        minInterval: 0.01,
        splitNumber: 5,
        min: this.minPrice,
        max: this.maxPrice,
      },
      series: [
        {
          data: linePrices,
          type: 'line',
          smooth: true,
        },
      ],
    };
  
    // Configure the candlestick chart
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
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: yZoomStart,
          end: yZoomEnd,
        },
        {
          type: 'slider',
          xAxisIndex: [0],
          bottom: '2%',
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          start: yZoomStart,
          end: yZoomEnd,
          right: '2%',
          orient: 'vertical',
        }
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
        min: this.minPrice,
        max: this.maxPrice,
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

  sendHistoryUpdate(price: number): void {
    if (!this.stockId) {
      console.error('No stock ID available');
      return;
    }

    if (!this.stompClient.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const historyUpdate: HistoryUpdate = {
      stockId: parseInt(this.stockId),
      date: new Date(),
      price: price
    };

    try {
      this.stompClient.publish({
        destination: '/app/update-history',
        body: JSON.stringify(historyUpdate)
      });
    } catch (error) {
      console.error('Failed to send history update:', error);
    }
  }
}
