import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { useState } from "react";

function StockMetricsTable({stockMetrics}: any) {
    console.log('StockMetricsTable stockMetrics:', stockMetrics);
    const headers = Object.keys(stockMetrics[0]).sort();
    const pageSize = 10;
    const pageCount = Math.ceil(stockMetrics.length / pageSize);
    console.log("stockMetrics.length:", stockMetrics.length);
    console.log("pageCount:", pageCount);
    const [ page, setPage ] = useState(0);

    const pageinationItems = [];
    for(let i=0; i<pageCount; i++) {
      pageinationItems.push(
      <Pagination.Item key={`page_${i}`} active={page==i} onClick={()=>{setPage(i)}}>
        {i+1}
      </Pagination.Item>);
    }
    
    let pageStart = page*pageSize;
    let pageStockMetrics = stockMetrics.slice(pageStart, pageStart+pageSize);

    return <>
    <Pagination>
      <Pagination.First onClick={()=>{setPage(0)}}/>
      <Pagination.Prev onClick={()=>{setPage(Math.max(page-1,0))}}/>
      {pageinationItems}
      <Pagination.Next onClick={()=>{setPage(Math.min(page+1,pageCount-1))}}/>
      <Pagination.Last onClick={()=>{setPage(pageCount-1)}}/>
    </Pagination>
    <Table bordered hover responsive>
      <thead>
        <tr>
          {headers.map((header, _)=>{
              return <th key={`header_${header}`}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {pageStockMetrics.map((stockMetric: any, index: number)=>{
          return <tr key={`metric_${index}`}>
             {  headers.map((header, _)=>{
                  return <td key={`metric_${index}_${header}`}>{stockMetric[header]}</td>;
             })}
          </tr>;
        })}
      </tbody>
    </Table>
  </>;
}

export default StockMetricsTable;