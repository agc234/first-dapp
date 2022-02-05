import { ethers } from 'ethers'

try {

	if (!window.ethereum) {
		throw 400
	}

	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = await provider.getSigner(window.ethereum.selectedAddress)
	console.log(signer)

	if (signer._address == null) {
		throw 300
	}

	/*
	const mooddb = {
		happy: '😊',
		sad: '😭',
		angry: '😡',
		irritated: '😒',
		scared: '😨',
		confused: '🥴',
		hungry: '😋',
		tired: '🥱'
	}
	*/

	let MoodContract
	let MoodContractAddress = "0x6BC292c5cF5e7B421D42bcF31948e18b864Cd2B3"
	let MoodContractABI = [
		{
			"inputs": [],
			"name": "getMood",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_mood",
					"type": "string"
				}
			],
			"name": "setMood",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]

	MoodContract = new ethers.Contract(
		MoodContractAddress,
		MoodContractABI,
		signer
	)

	const getMood = async () => {
		let getMoodPromise = await MoodContract.getMood();
		let feelh = document.getElementById('feeling')
		let mood = await getMoodPromise
		mood.replace(/^\w/, (c) => c.toUpperCase());
		feelh.innerText =  `I am feeling ${mood}`
	}

	async function setMood() {
		let mood = document.getElementById("mood").value

		let setMoodPromise = await MoodContract.setMood(mood)
	}

	const getBtn = document.getElementById('get')
	const setBtn = document.getElementById('set')

	getBtn.addEventListener('click', () => getMood())
	setBtn.addEventListener('click', () => setMood())

} catch(e) {
	const errorBtn = document.getElementById('error')
	const alert = document.getElementById('alert')
	const alerttxt = document.getElementById('alert-txt')

	if (e === 400) {
		alerttxt.innerHTML = "Metamask not found in this browser."
		alert.style.display = "block"
		console.error(`${e}: Metamask not detected.`)
	}

	if (e === 300) {
		alerttxt.innerHTML = "Metamask not signed in. "
		alert.style.display = "block"
		console.error(`${e}: Metamask detected, not accessible.`)
	}

	errorBtn.addEventListener('click', () => { 
		alert.style.display = "none"
		location.reload()
	})
}