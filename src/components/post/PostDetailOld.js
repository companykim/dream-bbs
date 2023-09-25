import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Fetch from 'toolbox/Fetch';
import { displayDate } from "toolbox/DateDisplayer";
import AppContext from "context/AppContextProvider";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NewReply from 'atom/NewReply';
import axios from 'api/axios';

function PostDetailOld() {
    const { auth } = useContext(AppContext);
    const location = useLocation();

    const state = location.state;
    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    const [renderCnt, setRenderCnt] = useState(0);
    
    const [justCreated] = useState(new Map());
    const [openAddReplay] = useState(new Map());
    const [replayOnReply] = useState(new Map());
    
    function onInputReplyContent(e, replyId) {
        const content = e.target.value;
        replayOnReply.set(replyId, content);
        setRenderCnt(renderCnt + 1);
    }

    function markShowAddReply(e, replyId) {
        openAddReplay.set(replyId, 1);
        setRenderCnt(renderCnt + 1);
    }

	const mngReply = async (e, parentId) => {
        // 목적: 재 조회 방지. 성능
        // parent 객체의 댓글 목록 ul을 찾아서 동적으로 강제적으로 넣기
        e.preventDefault();
		if (replayOnReply.get(parentId) === null || replayOnReply.get(parentId).length === 0)
			return;
        
		const bodyData = {
            firstVal:{id:parentId},
	        secondVal:{writer:{id:auth.userId, nick:auth.userNick}, content:replayOnReply.get(parentId)}
        };
		console.log(JSON.stringify(bodyData));

		try {
			const response = await axios.post(
				"/post/createReply",
				bodyData,
				{headers: {
					'Content-Type': 'application/json',
					"x-auth-token": `${auth.accessToken}`}}
			);
            const reply = response.data;
            justCreated.set(reply.parentId, reply);
            replayOnReply.set(parentId, "");
            setRenderCnt(renderCnt + 1);
		} catch (err) {
			console.log('Registration Failed');
		}
	}

    return <>
        <Link key={state.boardId} to={`/board`} state={state}>
            목록으로
        </Link>

        <Fetch uri={postUri} renderSuccess={RenderSuccess} />
    </>

    function appendJustCreatedReply(pid, reply, parent) {
        if (pid === parent.id) {
            if (! parent.listReply.includes(reply))
                parent.listReply = [reply, ...parent.listReply];
        }
    }

    function RenderSuccess(post) {
        justCreated.forEach((value, key)=>{appendJustCreatedReply(key, value, post)})

        return <>
            title : <h3>{post.title}</h3>
            content : <p>{post.content}</p>
            작성자 : {post.writer ? post.writer.nick : ""}
            readCnt : <span>{post.readCnt}</span>
            likeCnt : <span>{post.likeCnt} with button</span>
            disCnt : <span>{post.disCnt}</span>
            최종작성일 : <span>{displayDate(post.regDt, post.uptDt)} </span>
            {(post.writer ? post.writer.nick === auth.userNick : false) ?
                <Link
                    to="/post/managePost"
                    state={{ post: post }}
                >수정</Link> : ""}
            <br />
            <Button variant="primary" onClick={(e)=>{markShowAddReply(e, post.id)}}>댓글</Button>
            {openAddReplay.has(post.id) ? <NewReply auth={auth} reply={post} replayOnReply={replayOnReply} onInputReplyContent={onInputReplyContent} mngReply={mngReply}/> : ""}
            
            <Replies listReply={post.listReply} />
        </>
    }

    function Replies({ listReply = [] }) {
        if (!listReply || listReply.length === 0)
            return <ul>
            </ul>;
        return <ul>
            {listReply.map((reply) => {
                return <li key={reply.id}>
                    content : <span>{reply.content}</span>
                    최종작성일 : <span>{displayDate(reply.regDt, reply.uptDt)} </span>
                    작성자 : <span>{reply.writer ? reply.writer.nick : ""} </span>
                    <Button variant="primary" onClick={(e)=>{markShowAddReply(e, reply.id)}}>댓글</Button>
                    <br/>
                    {openAddReplay.has(reply.id) ? <NewReply auth={auth} reply={reply} replayOnReply={replayOnReply} onInputReplyContent={onInputReplyContent} mngReply={mngReply}/> : ""}
                    <Replies listReply={reply.listReply} />
                </li>
            })}
        </ul>
    }
}


export default PostDetailOld;