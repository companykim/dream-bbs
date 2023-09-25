import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'api/axios';
import AppContext from "context/AppContextProvider";
import AttachedFileList from 'atom/AttachedFileList';
import ThumbnailList from 'atom/ThumbnailList';

export default function PostMng() {
	const location = useLocation();
	//신규 시 post.boardVO.id 활용, 수정 시 모든 정보 활용
	const state = location.state;
	const post = location.state?.post;

	const { auth } = useContext(AppContext);
	const navigate = useNavigate();
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const [listAttach, setListAttach] = useState(post.listAttachFile);

	const [hasAllContents, setHasAllContents] = useState();
	useEffect(() => {
		setHasAllContents(title?.trim() ? content?.trim() : false);
	}, [title, content])

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!hasAllContents)
			return;

		const writer = { id: auth.userId, name: auth.userName, nick: auth.userNick };
		const bodyData = {
			id: post.id, writer: writer, boardVO: { id: post.boardVO.id },
			title: title.trim(), content: content.trim(), listAttachFile: listAttach
		};
		console.log(JSON.stringify(bodyData));

		try {
			await axios.post(
				"/post/mngPost",
				bodyData,
				{
					headers: {
						'Content-Type': 'application/json',
						"x-auth-token": `${auth.accessToken}`
					}
				}
			);
			navigate(`/board/${post.boardVO.id}/${state}`);

			//clear state and controlled inputs
			//need value attrib on inputs for this
		} catch (err) {
			console.log('Registration Failed');
		}
	}

	const handleDelete = async (e) => {
		e.preventDefault();

		try {
			const data = await axios.delete(`/post/${post.id}`,
				{headers: {
					'Content-Type': 'application/json',
					"x-auth-token": `${auth.accessToken}`}});
		} catch (err) {
			console.log('Delete Failed', err);
		} finally {
			// navigate state 전달
			navigate(`/board/${{boardId:post.boardVO.id}}`);
		}
	}

	return <Form>
		<h3>글쓰기</h3>
		<hr />
		<Form.Group className="mb-3" >
			<Form.Label >글제목:</Form.Label>
			<Form.Control
				type="text"
				value={title}
				id="title"
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
		</Form.Group>

		<Form.Group className="mb-3" >
			<Form.Label >글내용:</Form.Label>
			<Form.Control
				as="textarea"
				value={content}
				rows="5"
				id="content"
				onChange={(e) => setContent(e.target.value)}
				required
			/>
		</Form.Group>
		<ThumbnailList imgDtoList={listAttach} />
		<AttachedFileList writer={auth} listAttach={listAttach} setListAttach={setListAttach} />
		<Button variant="primary" onClick={handleSubmit} disabled={!hasAllContents} >
			반영
		</Button>
		<Button variant="primary" onClick={handleDelete} >
			삭제
		</Button>
	</Form>
}

