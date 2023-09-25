import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from "context/AppContextProvider";
import {Fetch} from 'toolbox/Fetch';
import { displayDate } from "toolbox/DateDisplayer";
import ReplyList from './ReplyList';
import ThumbnailList from 'atom/ThumbnailList';

export default function PostDetail() {
    const thumbnailRequestTarget = ["video", "image"];

    const { auth } = useContext(AppContext);
    const location = useLocation();

    const state = location.state;
    const postUri = `http://localhost:8080/post/anonymous/getPost/${state.id}`;

    return <>
        <Link key={state.boardId} to={`/board`} state={state}>
            목록
        </Link>
        <Fetch uri={postUri} renderSuccess={renderSuccess} />
    </>

    function renderSuccess(post) {
        console.log(post)
        return <>
            title : <h3>{post.title}</h3>
            content : <p>{post.content}</p>
            작성자 : {post.writer ? post.writer.nick : ""}
            <ThumbnailList imgDtoList={post.listAttachFile}/>
            readCnt : <span>{post.readCnt}</span>
            likeCnt : <span>{post.likeCnt} with button</span>
            disCnt : <span>{post.disCnt}</span>
            최종작성일 : <span>{displayDate(post.regDt, post.uptDt)} </span>
            {(post.writer ? post.writer.nick === auth.userNick : false) ?
                <Link
                    to="/post/managePost"
                    state= { {post, state} }
                >수정</Link> : ""
            }
            <br />
            <ReplyList parent={post} />
        </>
    }

}
