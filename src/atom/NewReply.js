import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NewReply({ auth, reply, replayOnReply, onInputReplyContent, mngReply }) {
    if (!auth.userNick)
        return;
    return (
        <Container>
            <Row>
                <Col>댓글 달기</Col>
            </Row>
            <Row>
                <Col sm={10}>
                    <input placeholder='댓글 달기'
                        value={replayOnReply.get(reply.id)}
                        style={{ height: "100%", width: "100%" }}
                        onInput={(e) => onInputReplyContent(e, reply.id)} />
                </Col>
                <Col sm><Button variant="primary" onClick={(e) => { mngReply(e, reply.id) }}>적용</Button></Col>
            </Row>
        </Container>
    );
}

export default NewReply;