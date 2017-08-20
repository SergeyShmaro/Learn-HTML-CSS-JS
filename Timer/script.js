const timer = document.querySelector('.timer');
const table = document.querySelector('.saveTable');
const saveBox = document.querySelector('.saveValueTable');
const contentBox = document.querySelector('.content');
const popupBox = document.querySelector('.popup');
const icon = document.querySelector('.changeIcon');
const firstInput = document.getElementById('firstIn');
const secondInput = document.getElementById('secondIn');
const thirdInput = document.getElementById('thirdIn');
const validateIcon = document.querySelector('.validateIcon');

const startBut = document.querySelector('.start');
const stopBut = document.querySelector('.stop');
const incsecBut = document.querySelector('.incsec');
const decsecBut = document.querySelector('.decsec');
const countdownBut = document.querySelector('.countdown');
const resettimerBut = document.querySelector('.resettimer');
const savevalBut = document.querySelector('.saveval');
const hideBut = document.querySelector('.hideBut');
const setTimerBut = document.querySelector('.setTimer')
const okBut = document.querySelector('.okBut');

let sec = 0, min = 0, hours = 0;
let timerId, reverseTimerId;
let isTable = false;
let countSaveVal = 0;
let currentIconClass = "fa-stop";

const start = () => {
	if (reverseTimerId) {
		clearInterval(reverseTimerId);
		reverseTimerId = null;
	}
	if(!timerId) {
		timerId = setInterval(addTime, 1000, 1);
	}
	icon.classList.remove(currentIconClass);
	currentIconClass = "fa-arrow-up";
	icon.classList.add(currentIconClass);
}

const addTime = x => {
	sec += x;
	if (sec < 0 && min > 0) {
		min--;
		sec += 60;
	} 
	if (sec < 0 && min == 0 && hours > 0) {
		hours--;
		min += 59;
		sec += 60;
	} 
	if (sec < 0 && min == 0 && hours == 0) {
		sec = 0;
	}
	if (sec >= 60) {
		min++;
		sec -= 60;
	}
	if (min >= 60) {
		hours++;
		min -= 60;
	}
	if (hours == 24 || (currentIconClass == "fa-arrow-down" && sec == 0)) {
		stop();
	}
	renderTime();
}

const incsec = () => {
	addTime(10);
}

const decsec = () => {
	addTime(-10);
}

const renderTime = () => {
	timer.textContent = ((hours != 0) ? hours  + ':' : '' ) 
					  + ((min > 9) ? min : ('0' + min)) + ':' 
					  + ((sec > 9) ? sec : ('0' + sec));
}

const stop = () => {
	if (timerId) {
		clearInterval(timerId);
		timerId = null;
	}
	if (reverseTimerId) {
		clearInterval(reverseTimerId);
		reverseTimerId = null;
	}
	icon.classList.remove(currentIconClass);
	currentIconClass = "fa-stop";
	icon.classList.add(currentIconClass);
}

const resettimer = () => {
	sec = 0;
	min = 0;
	hours = 0;
	renderTime();
}

const countdown = () => {
	if (timerId) {
		clearInterval(timerId);
		timerId = null;
	}
	if(!reverseTimerId) {
		reverseTimerId = setInterval(addTime, 1000, -1);
	}
	icon.classList.remove(currentIconClass);
	currentIconClass = "fa-arrow-down";
	icon.classList.add(currentIconClass);
}

const saveval = () => {
	if(!isTable) {
		contentBox.style.float = 'left';
		saveBox.style.display = 'block';
	}
	countSaveVal++;
	const li = document.createElement('li');
	li.textContent = countSaveVal + ') ' + timer.textContent;
	table.appendChild(li);
}

const hide = () => {
	saveBox.style.display = 'none';
	contentBox.style.float = 'none';

	while(table.firstChild) {
		table.removeChild(table.firstChild);
	}
	countSaveVal = 0;
}

const showPopup = () => {
	if (popupBox.style.display == "none" || popupBox.style.display == '') {
		setTimerBut.value = 'Hide "set timer" window';
		popupBox.style.display = "block";
		firstInput.value = hours;
		secondInput.value = (min > 9) ? min : ('0' + min);
		thirdInput.value = (sec > 9) ? sec : ('0' + sec);
	} else {
		setTimerBut.value = 'Set timer';
		popupBox.style.display = "none";
	}
}

const onInputForSetTimer = () => {
	if (secondInput.value > 59 || thirdInput.value > 59 || 
		firstInput.value > 23 ||
	    secondInput.value.search(/\D/) != -1 ||
	    thirdInput.value.search(/\D/) != -1 ||
	    firstInput.value.search(/\D/) != -1) {

		validateIcon.classList.remove("fa-check");
		validateIcon.classList.add("fa-times");
	} else {
		validateIcon.classList.remove("fa-times");
		validateIcon.classList.add("fa-check");
	}
}

const submitPopup = () => {
	if (validateIcon.classList.contains("fa-check")) {
		hours = +firstInput.value;
		min = +secondInput.value;
		sec = +thirdInput.value;
		setTimerBut.value = 'Set timer';
		popupBox.style.display = "none";
		renderTime();
	}
}

startBut.addEventListener('click', start);
incsecBut.addEventListener('click', incsec);
decsecBut.addEventListener('click', decsec);
stopBut.addEventListener('click', stop);
resettimerBut.addEventListener('click', resettimer);
countdownBut.addEventListener('click', countdown);
savevalBut.addEventListener('click', saveval);
hideBut.addEventListener('click', hide);
setTimerBut.addEventListener('click', showPopup);
okBut.addEventListener('click', submitPopup);

firstInput.oninput = onInputForSetTimer;
secondInput.oninput = onInputForSetTimer;
thirdInput.oninput = onInputForSetTimer;