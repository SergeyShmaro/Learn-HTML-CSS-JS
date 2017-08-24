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

const topSwitchBox = document.querySelector('.topSwitch');
const botSwitchBox = document.querySelector('.botSwitch');
const colon = document.querySelector('.colon');

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
let hourEnabled = true;

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
	if (min >= 60 && hourEnabled) {
		hours++;
		min -= 60;
	}
	if (hours == 0 && min == 0 && sec == 0 &&
		currentIconClass == "fa-arrow-down") {
		stop();
	}
	if (hours == 24) {
		min = 0;
		sec = 0;
		stop();
	}
	if (min == 1440) {
		sec = 0;
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
		saveBox.classList.remove("hide");
	}
	countSaveVal++;
	const li = document.createElement('li');
	li.textContent = countSaveVal + ') ' + timer.textContent;
	table.appendChild(li);
}

const hide = () => {
	saveBox.classList.add("hide");

	while(table.firstChild) {
		table.removeChild(table.firstChild);
	}
	countSaveVal = 0;
}

const showPopup = () => {
	if (popupBox.classList.contains('hide')) {
		setTimerBut.value = 'Hide "set timer" window';
		popupBox.classList.remove('hide');
		firstInput.value = hours;
		secondInput.value = (min > 9) ? min : ('0' + min);
		thirdInput.value = (sec > 9) ? sec : ('0' + sec);
		if (hourEnabled) {
			firstInput.focus();
		} else {
			secondInput.focus();
		}
	} else {
		setTimerBut.value = 'Set timer';
		popupBox.classList.add('hide');
	}
}

const firstInputOnInput = () => {
	validateInputs();
	if (firstInput.value.length == 2) {
		secondInput.focus();
	}
}

const secondInputOnInput = () => {
	validateInputs();
	if ((secondInput.value.length == 2 && hourEnabled) ||
		(secondInput.value.length == 4 && !hourEnabled)) {
		thirdInput.focus();
	}
}

const thirdInputOnInput = () => {
	validateInputs();
	if (thirdInput.value.length == 2) {
		okBut.focus();
	}
}

const validateInputs = () => {
	if (!isSetTimerValid()) {
		validateIcon.classList.remove("fa-check");
		validateIcon.classList.add("fa-times");
	} else {
		validateIcon.classList.remove("fa-times");
		validateIcon.classList.add("fa-check");
	}
}

const isSetTimerValid = () => {
	const first = firstInput.value;
	const second = secondInput.value;
	const third = thirdInput.value;

	if (hourEnabled && ((first > 23 || second > 59 || third > 59) &&
						(first == 24 && (second != 0 || third != 0)))) {
		return false;		
	}

	if (!hourEnabled && ((second > 1339 || third > 59) &&
						(second == 1440 && third != 0))) {
		return false;
	}

	if (first.search(/\D/) != -1 ||
		second.search(/\D/) != -1 ||
		third.search(/\D/) != -1) {
		return false;
	}

	return true;
}

const submitPopup = () => {
	if (validateIcon.classList.contains("fa-check")) {
		hours = +firstInput.value;
		min = +secondInput.value;
		sec = +thirdInput.value;
		setTimerBut.value = 'Set timer';
		popupBox.classList.add('hide');
		renderTime();
	}
}

const focusOnSetTimerInputs = () => {
	event.target.select();
}

const switchRender = () => {

	if (hourEnabled) {
		botSwitchBox.classList.remove('inactiveSwitch');
		topSwitchBox.classList.add('inactiveSwitch');
		hourEnabled = false;
		firstInput.classList.add('hide');
		colon.classList.add('hide');
		secondInput.setAttribute('maxlength', '4');
		secondInput.classList.add('increaseWidth');
	} else {
		topSwitchBox.classList.remove('inactiveSwitch');
		botSwitchBox.classList.add('inactiveSwitch');
		hourEnabled = true;
		firstInput.classList.remove('hide');
		colon.classList.remove('hide');
		secondInput.setAttribute('maxlength', '2');
		secondInput.classList.remove('increaseWidth');
	}

	if (!popupBox.classList.contains('hide')) {
		firstInput.value = hours;
		secondInput.value = (min > 9) ? min : ('0' + min);
		thirdInput.value = (sec > 9) ? sec : ('0' + sec);
	}
}

const hourSwitch = () => {
	if (!hourEnabled) {
		hours = Math.floor(min / 60);
		min -= hours * 60;
		renderTime();
		switchRender();
	}
}

const minSwitch = () => {
	if (hourEnabled) {
		min += hours * 60;
		hours = 0;
		renderTime();
		switchRender();
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

firstInput.addEventListener('input', firstInputOnInput);
secondInput.addEventListener('input', secondInputOnInput);
thirdInput.addEventListener('input', thirdInputOnInput);

firstInput.addEventListener('focus', focusOnSetTimerInputs);
secondInput.addEventListener('focus', focusOnSetTimerInputs);
thirdInput.addEventListener('focus', focusOnSetTimerInputs);

topSwitchBox.addEventListener('click', hourSwitch);
botSwitchBox.addEventListener('click', minSwitch);
