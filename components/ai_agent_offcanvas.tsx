'use client';

import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { Bot } from 'lucide-react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function AiAgentOffcanvas() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return  <>
        <Button variant="secondary" style={{position:"fixed", bottom:"32px", right:"32px"}} onClick={handleShow}>
            <Bot size={32} className="me-2 mb-1"/>Stock Agent
        </Button>

        <Offcanvas show={show} onHide={handleClose} data-bs-theme="dark" placement="end" style={{width:"480px"}}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title className="p-2">
                <Bot size={32} className="me-2 mb-1"/>Stock Agent
            </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="px-4">
                Hello, I'm your Stock agent. You can ask me anything related to stock market.
            </Offcanvas.Body>
            <InputGroup className="p-4">
                <Form.Control
                placeholder="Provide 5 tips about stock market investing"
                aria-describedby="basic-addon2"
                data-bs-theme="light"
                />
                <Button  variant="secondary" id="button-addon2">
                Send
                </Button>
            </InputGroup>
        </Offcanvas>
      </>;
}

export default AiAgentOffcanvas;