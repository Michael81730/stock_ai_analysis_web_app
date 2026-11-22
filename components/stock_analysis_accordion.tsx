'use client';

import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { CircleDollarSign, TextSearch, Image as ImageIcon, Bot } from 'lucide-react';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import Alert from 'react-bootstrap/Alert';
import LoadingModal from '@/components/loading_modal'
import ReactMarkdown from 'react-markdown';
import StockMetricsTable from '@/components/stock_metrics_table';
import { getStockMetrics } from '@/app/server_actions';

function StockAnalysisAccordion() {
    const [activeKey, setActiveKey] = useState("0");
    const [stockId, setStockId] = useState("");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [error, setError] = useState<string|null>(null);
    const [stockMetrics, setStockMetrics] = useState<{ Metric: string; Value: string }[]>([]);
    const [selectedAiPrompt, setSelectedAiPrompt] = useState("1");
    const [customAiPrompt, setCustomAiPrompt] = useState("");     
    const [aiResponse, setAiResponse] = useState("");
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [loadingModalText, setLoadingModalText] = useState("");

    const PredefinedAiPrompts : any = {
      "1": "Provide a detailed analysis of this stock's financial performance and key metrics.",
      "2": "Provide a detailed analysis of this stock's market trends and future outlook.",
      "3": "Provide investment suggestions based on this stock's performance and market conditions."
    } 

    const handleClickAccordionHeader = (eventKey: string)=>{
      console.log("Clicked AccordionHeader eventKey:", eventKey);
      setActiveKey(eventKey);
    }

    const handleClickConfirmStockIdBtn = ()=>{
      console.log("Clicked ConfirmStockIdBtn");
      console.log("stockId:", stockId);
      setSelectedStockId(stockId);
      setActiveKey("1");
    };

    const handleGetMetricsBtn = async ()=>{
      // setError(null);
      console.log("Clicked getMetricsBtn");
      if (selectedStockId == "") {
        setError("Please enter a valid stock symbol");
        return;
      }

      const response = await getStockMetrics(selectedStockId);
      console.log("getStockMetrics response: ", response);
      if (response.error != null) {
        setError(response.error);
        return;
      }

      setError(null);
      setStockMetrics(response.data.metrics??[]);
    };

    const handleChangeAiPrompt = (e: any)=>{
      console.log("handleChangeAiPrompt e.target.value:", e.target.value);
      setSelectedAiPrompt(e.target.value);
    };

    const handleClickAskAiBtn = async ()=>{
      if (selectedStockId == "") {
        setError("Please enter a valid stock symbol");
        return;
      }
      
      let aiPrompt = "";
      if (selectedAiPrompt == "0") {
        aiPrompt = customAiPrompt;
        if (aiPrompt == "") {
          setError("Custom prompt cannot be empty");
          return;
        }
      } else {
        aiPrompt = PredefinedAiPrompts[selectedAiPrompt];
      }
      setLoadingModalText("Waiting for AI response...");
      setShowLoadingModal(true);

      setError(null);
      setShowLoadingModal(false);
    }

    return <>
      {
        error ?
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
         {error}
        </Alert> : <></>
      }
      {/* <script type="module" src="https://cdn.jsdelivr.net/npm/zero-md@3?register"></script> */}
      <Accordion activeKey={activeKey} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={()=>handleClickAccordionHeader("0")}>
            <CircleDollarSign size={32} className="me-2"/>
            { selectedStockId ? `Entered Stock ${selectedStockId}` : "Enter a stock symbol" }</Accordion.Header>
          <Accordion.Body className="p-4">
              <Form.Label htmlFor="stock-id-input">Enter a stock symbol to analyze</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control id="stock-id-input" aria-describedby="basic-addon3" onChange={(e) => setStockId(e.target.value)}/>
                <Button variant="secondary" id="button-addon2" onClick={handleClickConfirmStockIdBtn}>
                  Confirm
                </Button>
              </InputGroup>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={()=>handleClickAccordionHeader("1")}>
            <TextSearch size={32} className="me-2"/>
            Fetch key financial and performance metrics</Accordion.Header>
          <Accordion.Body className="p-4">
            <Button variant="secondary" onClick={handleGetMetricsBtn}>
                Fetch metrics data
            </Button>
            {
              stockMetrics.length == 0 ? <></> :
              <div className="mt-4 px-3">
                <StockMetricsTable stockMetrics={stockMetrics}></StockMetricsTable>
              </div>
            }
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header onClick={()=>handleClickAccordionHeader("2")}>
            <Bot size={32} className="me-2"/>
            Get stock analysis</Accordion.Header>
          <Accordion.Body>
              <Form.Label>Select a prompt to ask AI about the selected stock</Form.Label>
              <InputGroup className="mb-3">
                <Form.Select onChange={handleChangeAiPrompt}>
                  <option value="1">Provide a detailed analysis of this stock's financial performance and key metrics.</option>
                  <option value="2">Provide a detailed analysis of this stock's market trends and future outlook.</option>
                  <option value="3">Provide investment suggestions based on this stock's performance and market conditions.</option>
                  <option value="0">Custom prompt</option>
                </Form.Select>
              </InputGroup>
              {
                selectedAiPrompt == "0" ?
                <>
                  <Form.Label htmlFor="custom-prompt-input">Enter your custom prompt</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control id="custom-prompt-input" aria-describedby="basic-addon3" onChange={(e) => setCustomAiPrompt(e.target.value)}/>
                  </InputGroup>
                </> : <></>
              }

              <Button variant="secondary" className="mb-2" onClick={handleClickAskAiBtn}>
                  Ask AI
              </Button>
              {
                aiResponse == "" ? <></>
                : <div className="mt-4">
                    <h4>AI Response</h4>
                    {/* <p>{aiResponse}</p> */}
                    {/* <zero-md>
                      <script type="text/markdown">
                        {aiResponse}
                      </script>
                    </zero-md> */}
                    <ReactMarkdown components={{h3:'h4'}}>
                      {aiResponse}
                    </ReactMarkdown>
                  </div>
              }
            
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <LoadingModal show={showLoadingModal} text={loadingModalText}></LoadingModal>
    </>;
}

export default StockAnalysisAccordion;