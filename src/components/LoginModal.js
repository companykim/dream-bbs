import { useRef, useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import AppContext from "context/AppContextProvider";

function LoginModal() {
  const { auth, setAuth } = useContext(AppContext);
  let userNickRef = useRef();

  const [userNick, setUserNick] = useState('');
  const [pwd, setPwd] = useState('');
  const [signInResult, setSignInResult] = useState({});
  const [errMsg, setErrMsg] = useState('');

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*맨 처음 틀때 만.. 사용자 ID 받는 곳에 focus 준다. 
  Bootstrap Form.Control에서의 focus() 연구 필요
  useEffect(() => {
    userRef.current.focus();
  }, [])
  */
  //user, pwd의 변화 시 ErrMsg clearing
  useEffect(() => {
    setErrMsg('');
  }, [userNick, pwd])

  /*
  async await에 대한.. eoor 처리는 보류중
  */
  async function signIn(){
    const jsonData = await fetch(`http://localhost:8080/sign-api/sign-in`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userNick, password: pwd }),
    }).then(res => res.json());
    console.log(jsonData);
    if (!jsonData.success)
      throw new Error(JSON.stringify(jsonData));
    return jsonData;
  }
  
  async function handleSubmit(){
    var signInResult;
    try {
      signInResult = await signIn();
      console.log("success");
      console.log(signInResult);

      const accessToken = signInResult.token;
      const userId = signInResult.userId;
      const userName = signInResult.userName;
      const userNick = signInResult.userNick;
      const roles = signInResult.roles;

      setAuth({ accessToken, userId, userName, userNick, roles });
      setUserNick('');
      setPwd('');
      setShow(false);
    } catch(error){
      console.log("fail");
      console.log(error.message);
      setError(true);
      setErrMsg('Login Failed');
      setAuth({});
      setSignInResult({});
      setShow(true);
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    setAuth({});
    setSignInResult({});
    setShow(false);
  }

  function setFocusOnUser() {
    ReactDOM.findDOMNode(userNickRef).focus();
  }

  return auth?.userNick ? (
    <section>
      <h4>{auth.userNick}님 환영합니다</h4>
      <br />
      <p>
        <a href="#">Go to Home</a>
      </p>
      <Button variant="primary" style={{ float: 'right', marginRight: '100px' }}
        onClick={handleLogout}>나가기</Button>
    </section>
  ) : (
    <>
      <Button variant="primary" style={{ float: 'right', marginRight: '100px' }}
        onClick={handleShow}>
        로그인
      </Button>
      <Link to="/sign-up">회원가입</Link>
      <Modal show={show} onHide={handleClose} onShow={setFocusOnUser}>
        <Modal.Header closeButton>
          {error ? <Form.Label>{errMsg}</Form.Label> : ""}
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label htmlFor="userNick">UserNick:</Form.Label>
              <Form.Control
                type="text"
                id="userNick"
                ref={c => (userNickRef = c)}
                autoComplete="off"
                onChange={(e) => setUserNick(e.target.value)}
                value={userNick}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label htmlFor="password">Password:</Form.Label>
              <Form.Control
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
    ;
}

export default LoginModal;