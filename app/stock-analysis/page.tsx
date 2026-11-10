import Container from 'react-bootstrap/Container';
import StockAnalsysAccordion from "@/components/stock_analysis_accordion"
import AiAgentOffcanvas from "@/components/ai_agent_offcanvas"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
     const cookieStore = await cookies();
    if(!cookieStore.has("access")) {
        redirect('/login');
    }
    
  return <Container className="mt-4">
    <StockAnalsysAccordion></StockAnalsysAccordion>
    <AiAgentOffcanvas></AiAgentOffcanvas>
  </Container>;
}
