import React, { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Fetch } from 'toolbox/Fetch';
import { displayDate } from "toolbox/DateDisplayer";
import AppContext from "context/AppContextProvider";

export default function PostList() {
    const { auth } = useContext(AppContext);
    const isMember = auth?.roles?.includes("member");
    
    const location = useLocation();
	let state = location.state;
    console.log("PostList param", state);

    function buildUrl(step) {
        console.log("buildUrl(step", step);
        if (state.search) 
            return `http://localhost:8080/post/anonymous/search/${state.boardId}/${state.search}/${state.page}`;
         else 
            return `http://localhost:8080/post/anonymous/listAll/${state.boardId}/${state.page}`;
        
    }
    const [postListUri, setPostListUri] = useState(buildUrl(222));

    const [targetBoard, setTargetBoard] = useState(state.boardId);
    console.log("saved targetBoard", targetBoard);

    if (targetBoard !== state.boardId) {
        console.log("targetBoard chaging", state.boardId);
        setTargetBoard(state.boardId);
        setPostListUri(buildUrl());
        console.log("다시 그리기 시작해");
    }

    function goTo(choosenPage) {
        state.postListWithPaging = null;
        state.page = choosenPage;

        setPostListUri(buildUrl());
    }
    
    const txtSearch = useRef();

    const onSearch = (e) => {
        e.preventDefault();
        let search = txtSearch.current.value;

        state.postListWithPaging = null;
        state.search = search;
        state.page = 1;

        setPostListUri(buildUrl());
    }

    const displayPagination = (paging) => {
        const pagingBar = [];
        if (paging.prev)
            pagingBar.push(<button key={paging.startPage - 1} onClick={(e) => goTo(paging.startPage - 1)}>&lt;</button>);
        for (let i = paging.startPage; i <= paging.lastPage; i++) {
            pagingBar.push(<button key={i} onClick={(e) => goTo(i)}>{i}</button>);
        }
        if (paging.next)
            pagingBar.push(<button key={paging.lastPage + 1} onClick={(e) => goTo(paging.lastPage + 1)}>&gt;</button>);
        return pagingBar;
    }

    function renderSuccess(postListWithPaging) {
        const postList = postListWithPaging.firstVal;
        const pagenation = postListWithPaging?.secondVal;
        return <>
            <table>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>좋아요수</th>
                        <th>최종수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {postList?.map(post => (
                        <tr key={post.id}>
                            <td>
                                <Link key={post.id} to={`/post`}
                                      state={{ id:post.id, boardId:state.boardId, page: state.page, search: txtSearch.current?.value, postListWithPaging}}>
                                    &nbsp;&nbsp;{post.title}
                                </Link>
                            </td>
                            <td>{post.writer ? post.writer.name : ""}</td>
                            <td>{post.readCnt}</td>
                            <td>{post.likeCnt}</td>
                            <td>최종작성일 : <span>{displayDate(post.regDt, post.uptDt)} </span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pagenation?displayPagination(pagenation):""}
        </>
    }

    return (
        <div>
            <input placeholder='검색어를 넣으세요' ref={txtSearch}></input>
            <button key={"btnSearch"} onClick={onSearch}>검색</button>

            {isMember ?
                <Link
                    to="/post/managePost"
                    state={{ post: { boardVO: { id: state.boardId }, listAttachFile:[] } }}>
                    글쓰기
                </Link> : null
            }
            <Fetch uri={postListUri} renderSuccess={renderSuccess} />
        </div>
    );
}

