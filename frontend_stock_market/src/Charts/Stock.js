import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Stock.css';

function StockChart() {
    const [history, setHistory] = useState({});
    const { stockId } = useParams();
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [stockName, setStockName] = useState('');

    const fetchHistory = async (stockId) => {
        try {
            const response = await axios.get(`http://localhost:9999/history/${stockId}`);
            if (response.status === 200) {
                setHistory(response.data.history);
                setStockName(response.data.name);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        fetchHistory(stockId);
    }, [stockId]);

    useEffect(() => {
        if (Object.keys(history).length > 0) {
            drawChart();
        }
    }, [history]);

    const drawChart = () => {
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Remove any previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Process history data
        const data = processHistoryData(history);

        // Set scales with clamp to prevent panning beyond data extent
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width])
            .clamp(true);

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(data, d => d.low) * 0.995,
                d3.max(data, d => d.high) * 1.005
            ])
            .range([height, 0])
            .clamp(true);

        // Create SVG with clip path
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        // Add clip path
        svg.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        // Create chart group
        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add rect to capture mouse events
        const zoomRect = chartGroup.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all');

        // Create content group with clip path
        const contentGroup = chartGroup.append('g')
            .attr('clip-path', 'url(#clip)');

        // Define candlestick width
        const candlestickWidth = Math.max((width / data.length) * 0.8, 2);

        // Create axes groups
        const xAxisGroup = chartGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`);

        const yAxisGroup = chartGroup.append('g')
            .attr('class', 'y-axis');

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).tickFormat(d => `₹${d}`);

        // Add grid lines
        const gridGroup = contentGroup.append('g')
            .attr('class', 'grid');

        gridGroup.append('g')
            .attr('class', 'grid-x')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat(""));

        gridGroup.append('g')
            .attr('class', 'grid-y')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat(""));

        // Create tooltip
        const tooltip = d3.select(chartRef.current)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.7)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none');

        // Function to draw candlesticks
        const drawCandlesticks = (scales) => {
            const candlesticks = contentGroup.selectAll('.candlestick')
                .data(data);

            candlesticks.exit().remove();

            const candlestickGroups = candlesticks.enter()
                .append('g')
                .attr('class', 'candlestick')
                .merge(candlesticks)
                .attr('transform', d => `translate(${scales.x(d.date)},0)`);

            // Update wicks
            candlestickGroups.selectAll('.wick')
                .data(d => [d])
                .join('line')
                .attr('class', 'wick')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', d => scales.y(d.high))
                .attr('y2', d => scales.y(d.low))
                .attr('stroke', d => d.close >= d.open ? '#22c55e' : '#ef4444')
                .attr('stroke-width', 1);

            // Update bodies
            candlestickGroups.selectAll('.body')
                .data(d => [d])
                .join('rect')
                .attr('class', 'body')
                .attr('x', -candlestickWidth / 2)
                .attr('y', d => scales.y(Math.max(d.open, d.close)))
                .attr('width', candlestickWidth)
                .attr('height', d => Math.abs(scales.y(d.open) - scales.y(d.close)))
                .attr('fill', d => d.close >= d.open ? '#22c55e' : '#ef4444')
                .on('mouseenter', (event, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 1);
                    tooltip.html(`
                        <strong>Date:</strong> ${d.date.toLocaleString()}<br/>
                        <strong>Open:</strong> ₹${d.open.toFixed(2)}<br/>
                        <strong>Close:</strong> ₹${d.close.toFixed(2)}<br/>
                        <strong>High:</strong> ₹${d.high.toFixed(2)}<br/>
                        <strong>Low:</strong> ₹${d.low.toFixed(2)}
                    `)
                    .style('left', `${event.pageX + 5}px`)
                    .style('top', `${event.pageY - 28}px`);
                })
                .on('mouseleave', () => {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        };

        // Initial draw
        drawCandlesticks({ x: xScale, y: yScale });
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        // Initialize zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 20]) // Zoom scale range
            .extent([[0, 0], [width, height]])
            .translateExtent([[0, -Infinity], [width, Infinity]]) // Allow vertical panning
            .on('zoom', (event) => {
                const newXScale = event.transform.rescaleX(xScale);
                const newYScale = event.transform.rescaleY(yScale);

                // Update axes with transition
                xAxisGroup.transition()
                    .duration(50)
                    .call(xAxis.scale(newXScale));
                yAxisGroup.transition()
                    .duration(50)
                    .call(yAxis.scale(newYScale));

                // Update grid
                gridGroup.select('.grid-x').transition()
                    .duration(50)
                    .call(d3.axisBottom(newXScale)
                        .tickSize(-height)
                        .tickFormat(""));
                gridGroup.select('.grid-y').transition()
                    .duration(50)
                    .call(d3.axisLeft(newYScale)
                        .tickSize(-width)
                        .tickFormat(""));

                // Update candlesticks
                drawCandlesticks({ x: newXScale, y: newYScale });
            });

        // Add double-click to reset zoom
        zoomRect.on('dblclick', () => {
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        });

        // Apply zoom behavior
        svg.call(zoom);

        // Add zoom instructions
        svg.append('text')
            .attr('x', margin.left)
            .attr('y', margin.top - 5)
            .attr('class', 'zoom-instruction')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Use mouse wheel to zoom, drag to pan, double-click to reset');
    };

    const processHistoryData = (history) => {
        const timeInterval = 1 * 60 * 1000;
        const data = [];
        let currentInterval = null;
        let openPrice = null;
        let highPrice = -Infinity;
        let lowPrice = Infinity;
        let closePrice = null;

        Object.entries(history).forEach(([timestamp, price]) => {
            const date = new Date(timestamp);
            const intervalStart = Math.floor(date.getTime() / timeInterval) * timeInterval;

            if (currentInterval !== intervalStart) {
                if (currentInterval !== null) {
                    // Push the previous interval data to the array
                    data.push({
                        date: new Date(currentInterval),
                        open: openPrice,
                        close: closePrice,
                        high: highPrice,
                        low: lowPrice,
                    });
                }

                // Start a new interval
                currentInterval = intervalStart;
                openPrice = price;
                highPrice = price;
                lowPrice = price;
                closePrice = price;
            } else {
                // Update the high, low, and close for the current interval
                highPrice = Math.max(highPrice, price);
                lowPrice = Math.min(lowPrice, price);
                closePrice = price;
            }
        });

        // Add the last interval
        if (currentInterval !== null) {
            data.push({
                date: new Date(currentInterval),
                open: openPrice,
                close: closePrice,
                high: highPrice,
                low: lowPrice,
            });
        }

        return data;
    };

    return (
        <div>
            <h1>Stock History for {stockName}</h1>
            <div ref={containerRef} style={{ width: '100%', height: '500px' }}>
                <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
}

export default StockChart;
