import Container from 'react-bootstrap/Container';
import StockAnalsysAccordion from "@/components/stock_analysis_accordion"
import AiAgentOffcanvas from "@/components/ai_agent_offcanvas"
import { checkAuth } from '@/app/server_actions'

export default async function Page() {
  await checkAuth();
    
  return <Container className="mt-4">
    <StockAnalsysAccordion></StockAnalsysAccordion>
    <AiAgentOffcanvas></AiAgentOffcanvas>
  </Container>;
}
