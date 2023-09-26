import axios from 'api/axios';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import AttachFile from './AttachFile';

export default function AttachedFileList({ writer, listAttach, setListAttach }) {
  const thumbnailRequestTarget = ["video", "image"];
  //검사 장치
  const [contentFilter, setContentFilter] = useState([]);
  //지금까지 선택한 파일 기억장치. 업로드 용도
  const [업로드파일기억장치, set업로드파일기억장치] = useState([]);
  const [imgDtoList, setImgDtoList] = useState([]);

  const [imgSrc, setImgSrc] = useState([]);
  const [attachedFileUrls, setAttachedFileUrls] = useState([]);

  function onFileSelect(finedAndHeaders) {
    let files = [], headers = [];
    finedAndHeaders.forEach(({ file, header }) => {
      if (!contentFilter.includes(header) && !headers.includes(header)) {
        files.push(file);
        headers.push(header);
      }
    });
    if (files.length > 0) {
      setContentFilter([...contentFilter, ...headers]);
      set업로드파일기억장치([...업로드파일기억장치, ...files]);
    }
  }

  //지정된 파일들을 axios로 Server로 올리기하면 썸네일로 첨부파일들을 목록으로 보여준다.
  const handleAttach = (e) => {
    e.preventDefault();
    if (업로드파일기억장치.length === 0)
      return;
    const formData = new FormData();
    // 동일 key에 여러개 할당 가능?
    Array.from(업로드파일기억장치).forEach((file) => {
      formData.append("attachFiles", file);
    });
    axios.post(`/upload_multi`, formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": `Bearer ${writer.accessToken}`
        }
      }).then(res => {
        const listDto = res.data;
        setImgDtoList(listDto);
        setListAttach([...listAttach, ...listDto])
      }).catch((error) => {
        console.log(error);
      }).finally(()=>{
        set업로드파일기억장치([]);
      });
    //      setTimeout(()=>{setImgSrc([...imgSrc, ...collection]);}, 100);
    console.log("handleAttach Done");
  }

  return <Form.Group className="mb-3" >
    <Form.Label htmlFor="username">첨부파일</Form.Label>
    <AttachFile onFileSelect={onFileSelect} />
    <Button variant="primary" onClick={handleAttach}>
      첨부
    </Button>
  </Form.Group>
}