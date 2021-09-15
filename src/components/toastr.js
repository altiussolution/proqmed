import React , {useState} from "react"
import Toast from 'react-bootstrap/Toast';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Toastr  = (data) => {
    const [tostrShow, setTostrShow] = useState(true);
    return (
        <Row className="toast_msg">
            <Col xs={12}>
                <Toast  style={{
                position: 'absolute',
                top: 0,
                right: 0,
                }} onClose={() => setTostrShow(false)} show={tostrShow} >
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded mr-2"
                    alt=""
                    />
                    <strong className="mr-auto">Message</strong>
                </Toast.Header>
                <Toast.Body>{data.message}</Toast.Body>
                </Toast>
            </Col>
        </Row>
    )

}

export default Toastr;