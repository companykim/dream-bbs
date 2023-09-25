import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef, useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import axios from 'api/axios';
import AppContext from "context/AppContextProvider";

const Register = () => {
	const { codeList } = useContext(AppContext);

	const [userName, setUserName] = useState('');
	const [userNick, setUserNick] = useState('');

	const [pwd, setPwd] = useState('');
	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState();

	const [userSex, setUserSex] = useState();

	const [listCP, setListCP] = useState(new Map());

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		setValidMatch(pwd ? pwd === matchPwd : false);
	}, [pwd, matchPwd])

	useEffect(() => {
		setErrMsg('');
	}, [userName, pwd, matchPwd])

	const checkCPValidity = (cpType, inValue) => {
		if (cpType.validationRe && !(new RegExp(cpType.validationRe).test(inValue))) {
			return;
		}
		//복제하고
		listCP.set(cpType, inValue);
		setListCP(listCP);
	};

	const checkSex = (e) => {
		console.log("checkSex");
		console.log(e.target.value);
		setUserSex(e.target.value);
	};

	const onBlurNick = async (e) => {
		e.preventDefault();
		console.log("onBlurNick");
		try {
			const response = await axios.get(`/party/anonymous/checkNick?nick=${e.target.value}`);
			console.log(response?.data);
			console.log(JSON.stringify(response))
		} catch (err) {
			setErrMsg('jkhgiujhg')
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validMatch)
			return;

		let list = [];
		//list = listCP.entries().next((key, value)=>({cpType:key, cpVal:value})).collect();
		for (let [key, value] of listCP) {
			list.push({ cpType: key, cpVal: value });
		}

		const bodyData = {
			organization: { id: "0000" },
			name: userName,
			nick: userNick,
			pwd: pwd,
			sex: userSex,
			listContactPoint: list
		};
		console.log(JSON.stringify(bodyData))

		try {
			const response = await axios.post("/party/anonymous/createMember",
				JSON.stringify(bodyData),
				{
					headers: { 'Content-Type': 'application/json' }
				}
			);
			console.log(response?.data);
			console.log(JSON.stringify(response))
			setSuccess(true);
			//clear state and controlled inputs
			//need value attrib on inputs for this
		} catch (err) {
			setErrMsg('Registration Failed')
		}
	}

	return success ? (
		<section>
			<h1>Success!</h1>
			<p>
				<a href="#">Sign In</a>
			</p>
		</section>
	) : (
		<Form>
			<Form.Group className="mb-3" >
				<Form.Label htmlFor="username">이름:</Form.Label>
				<Form.Control
					type="text"
					id="username"
					onChange={(e) => setUserName(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group className="mb-3" >
				<Form.Label htmlFor="userNick">사용자 닉:</Form.Label>
				<Form.Control
					type="text"
					id="userNick"
					onChange={(e) => setUserNick(e.target.value)}
					required
					onBlur={onBlurNick}
				/>
			</Form.Group>

			<Form.Group className="mb-3" >
				<Form.Label htmlFor="userPwd">암호:</Form.Label>
				<Form.Control
					type="password"
					id="userPwd"
					onChange={(e) => setPwd(e.target.value)}
					value={pwd}
					required
				/>
				<Form.Label htmlFor="userMatchPwd">암호확인:</Form.Label>
				<Form.Control
					type="password"
					id="userMatchPwd"
					onChange={(e) => setMatchPwd(e.target.value)}
					value={matchPwd}
					required
				/>
			</Form.Group>
			<Form.Group className="mb-3" >
				<Form.Label htmlFor="userSex">성별:</Form.Label>
				<div key={`inline-radio`} className="mb-3">
					<Form.Check
						inline
						defaultChecked
						label="남성"
						name="userSex"
						type="radio"
						value={true}
						onChange={checkSex}
						id={`inline-radio-1`}
					/>
					<Form.Check
						inline
						label="여성"
						name="userSex"
						type="radio"
						onChange={checkSex}
						value={false}
						id={`inline-radio-2`}
					/>
				</div>
			</Form.Group>
			<Form.Group className="mb-3" >
				{codeList.map((cpType) => (<>
					<Form.Label htmlFor={cpType.codeVal}>{cpType.codeVal}:</Form.Label>
					<Form.Control
						type="text"
						id={cpType.codeVal}
						onChange={(e) => checkCPValidity(cpType.codeVal, e.target.value)}
					/>
				</>))}
			</Form.Group>
			<Button variant="primary" onClick={handleSubmit} disabled={!validMatch}>
				Sign Up
			</Button>
		</Form>
	)
}

export default Register;
