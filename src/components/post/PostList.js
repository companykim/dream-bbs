import React, { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Fetch} from 'toolbox/Fetch';
import { displayDate } from "toolbox/DateDisplayer";
import AppContext from "context/AppContextProvider";

export default function PostList() {
    const location = useLocation();

    const { auth } = useContext(AppContext);
    const isMember = auth?.roles?.includes("member");
	const state = location.state;
    const [currentPage, setCurrentPage] = useState(state.page);
    const txtSearch = useRef();
    let initUrl;
    if (state.search) {
        initUrl = `http://localhost:8080/post/anonymous/search/${state.boardId}/${state.search}/${state.page}`
    } else {
        initUrl = `http://localhost:8080/post/anonymous/listAll/${state.boardId}/${state.page}`;
    }
    const [postListUri, setPostListUri] = useState(initUrl);

    function buildPostListUri(page) {
        let search = txtSearch.current.value;
        console.log("search 입력값 : " + search);
        if (!search && state.search)
            search = state.search;

        console.log("이전 url : " + postListUri);
        if (search.trim()) {
            console.log("검색 조회 : ");
            setPostListUri(`http://localhost:8080/post/anonymous/search/${state.boardId}/${search}/${page}`);
            console.log(`검색 http://localhost:8080/post/anonymous/search/${state.boardId}/${search}/${page}`);
        } else {
            console.log("기본 조회 : ");
            setPostListUri(`http://localhost:8080/post/anonymous/listAll/${state.boardId}/${page}`);
            console.log(`기본 http://localhost:8080/post/anonymous/listAll/${state.boardId}/${page}`);
        }
        console.log("CurrentPage : " + currentPage);
        setCurrentPage(page);
        console.log("setCurrentPage(choosenPage)호출 이후 : " + currentPage);
        //useState로 관리되는 값은 한 사이클 이후 읽기 가능하군요
    }

    const onSearch = (e) => {
        e.preventDefault();
        state.postListWithPaging = null;
        state.search = null;
        buildPostListUri(1);
    }

    function goTo(choosenPage) {
        state.postListWithPaging = null;
        buildPostListUri(choosenPage);
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
                                      state={{ id:post.id, boardId:state.boardId, page: currentPage, search: txtSearch.current?.value, postListWithPaging}}>
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
                    state={{ post: { boardVO: { id: state.boardId } } }}>
                    글쓰기
                </Link> : ""}
            {state.postListWithPaging?renderSuccess(state.postListWithPaging):
                <Fetch uri={postListUri} renderSuccess={renderSuccess} />
            }
        </div>
    );
}

