import { useRef, useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'api/axios';

import AppContext from "context/AppContextProvider";

export default function OriginalFileView( {imgUrl, afdto} ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [originalFileUrl, setOriginalFileUrl] = useState(false);

  const buildUrl = (blob) => {
    console.log("buildUri = (blob)", blob);
    const originalFile = new File([blob.data], afdto.originalFilePureName, {type : afdto.contentType});
    setOriginalFileUrl((window.URL || window.webkitURL).createObjectURL(originalFile));
    setShow(true);
  }
  const getOriginalFile = () => {
    axios.post(`/anonymous/getOriginalFile`, afdto,
      {
        header: { "Content-Type" : "application/json" },
        responseType : "blob"
      })
      .then(buildUrl)
      .catch(error=> {
        console.log("getOriginalFile", error);
      });
  }

  return <>
      <img src={imgUrl} onClick={(e) => {getOriginalFile()}} />
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>{afdto.originalFilePureName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" >
              {afdto.contentType === "image" ? <img src={originalFileUrl}/>:
              afdto.contentType === "video" ? <video src={originalFileUrl} controls autoplay/>: null
              }

            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
}