import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Container from 'react-bootstrap/Container';

export default async function Page() {
       const cookieStore = await cookies();
      if(!cookieStore.has("access")) {
          redirect('/login');
      }
      
  return <>
      <Container className="mt-5" style={{width:"28em"}}>
        <h1>Analysis History</h1>
      </Container>
  </>;
}
