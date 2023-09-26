import axios from 'api/axios';
import NewReply from 'atom/NewReply';
import AppContext from "context/AppContextProvider";
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { displayDate } from "toolbox/DateDisplayer";

export default function ReplyList({parent}) {
    const { auth } = useContext(AppContext);

    const [justCreatedReplyList, setJustCreatedReplyList] = useState([]);
    const [openAddReplay] = useState(new Map());
    const [replayOnReply] = useState(new Map());

    const [renderCnt, setRenderCnt] = useState(0);

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
	        secondVal:{content:replayOnReply.get(parentId)}
        };
		console.log(JSON.stringify(bodyData));

		try {
			const response = await axios.post(
				"/post/createReply",
				bodyData,
				{headers: {
					'Content-Type': 'application/json',
					"x-auth-token": `Bearer ${auth.accessToken}`}}
			);
            const reply = response.data;
            setJustCreatedReplyList([reply, ...justCreatedReplyList]);
            replayOnReply.set(parentId, "");
            setRenderCnt(renderCnt + 1);
		} catch (err) {
			console.log('Registration Failed');
		}
	}

    function appendJustCreatedReply(newReply, parent) {
        if (! parent.listReply.includes(newReply))
            parent.listReply = [newReply, ...parent.listReply];
    }

    justCreatedReplyList.forEach((newReply)=>{appendJustCreatedReply(newReply, parent)})

    return <>
            {auth.userNick ? 
            <Button variant="primary" onClick={(e)=>{markShowAddReply(e, parent.id)}}>
                댓글
            </Button> :  ""}
            
            {openAddReplay.has(parent.id) ? <NewReply auth={auth} reply={parent} replayOnReply={replayOnReply} onInputReplyContent={onInputReplyContent} mngReply={mngReply}/> : ""}
            <ul>
        {parent.listReply?.map((reply) => {
            return <li key={reply.id}>
                content : <span>{reply.content}</span>
                최종작성일 : <span>{displayDate(reply.regDt, reply.uptDt)} </span>
                작성자 : <span>{reply.writer ? reply.writer.nick : ""} </span>
                <ReplyList parent={reply}/>
            </li>
        })}
    </ul>
    </>
}


