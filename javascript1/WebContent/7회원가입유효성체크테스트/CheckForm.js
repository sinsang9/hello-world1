/*
Register.html 값들이 유효한지 확인함
- 이름: 2자~5자
 - ID: 3자~8자
 - 비밀번호 : 8자~12자, 초기화
 - 비밀번호 확인
 - 주민번호 앞자리 6자리
 - 주민번호 뒷자리 7자리
 */
 
function CheckForm() {
	var uName = document.getElementById("uName");
	var uID = document.getElementById("uID");
	var uPWD = document.getElementById("uPWD");
	var uPWD_Confirm = document.getElementById("uPWD_Confirm");
	var uBirth = document.getElementById("uBirth");
	var uBirth_2 = document.getElementById("uBirth_2");
	var work = document.getElementById("work");
	var motivation = document.getElementsByName("motivation");
	var sex = document.getElementsByName("sex");
	var hobby = document.getElementsByName("hobby");

	//이름을 2자 미만 또는 5자보다 초과 작성 했을 경우  
	if (uName.value.length < 2 || uName.value.length > 5) {
		alert("이름은 2자~5자 이내로 작성하시오");
		uName.select();
		return false;
	}
	//아이디를 입력 하지 않았을 경우 
	if (uID.value == "") {
		alert("아이디를 입력해주세요.");
		return false;
	}
	//비밀번호를 8자 미만 또는 12자 보다 초과로 작성 했을 경우
	if (uPWD.value.length < 8 || uPWD.value.length > 12) {
		alert("비밀번호는 8자~12자 이내입니다.");
		uPWD.value = "";
		return false;
	}

	//비밀번호 값과 비밀번호확인 값이 다를 경우 
	if (uPWD.value != uPWD_Confirm.value) {
		alert("비밀번호 값이 다릅니다.");
		//비밀번호 확인 란에 빈공백 주기
		uPWD_Confirm.value = "";
		return false;
	}

	// 주민번호 양식
	if (CheckRRN(uBirth, uBirth_2) == false) {
		return false;
	}

	if (motivation.value == "") {
		alert("가입인사를 적어주세요~")
		return false;
	}
	if (!CheckValue(sex)) {
		alert("성별을 체크해주세요.");
		return false;
	}

	if (!CheckValue(hobby)) {
		alert("취미를 체크해주세요.");
		return false;
	}

	if (work.options.selectedIndex == 0) {
		alert("직업을 체크해주세요.");
		return false;
	}

}

function CheckValue(obj) {// 체크 여부 확인
	var value = 0;
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked == true) {
			value = 1;
			break;
		}
	}
	if (value == 0)
		return false;
	else
		return true;
}

function CheckRRN(num1, num2) { //입력한 주민번호 앞자리와 뒷자리를 전달받아

	/*
	 * 주민번호 예외처리 (주민번호 앞번호: YYMMDD) 1. 
	 * 앞번호 6자리, 뒷번호 7자리 아닌 경우 2. 
	 * MM이 1월~12월 외의 값인 경우 3. 
	 * DD이 1일~31월 외의 값인 경우 4. 
	 * 국내기준 : 뒷번호 시작이 1~4 외의 값인 경우
	 */
	
	var mm = num1.value.substr(2, 2);//880214중에 02

	var dd = num1.value.substr(4, 2);//880214중에 14
	
	var sex = num2.value.substr(0, 1);//1234567 중에 1
	
	//올바른 주민 등록번호 형식인지 유효성 체크
	if (num1.value.length != 6 || 
		num2.value.length != 7 || 
		mm < 1 || 
		mm > 12|| 
		dd < 1 || 
		dd > 31 || 
		sex < 1 || 
		sex > 4) {
		window.alert("올바른 주민등록번호 형식이 아닙니다.");
		num1.focus();
		return false;
	}

	
	if (isValidRRN(num1, num2) == false) {
		window.alert("유효한 주민번호가 아닙니다.");
		return false;
	}

}
function isValidRRN(num1, num2) {
	/*
	 * 주민등록번호 체크 로직 (출처 http://delirussum.tistory.com) 1. 주민등록번호의 앞 6자리의 수에 처음부터
	 * 차례대로 2,3,4,5,6,7 을 곱한다. 그 다음, 뒤 7자리의 수에 마지막 자리만 제외하고 차례대로 8,9,2,3,4,5 를
	 * 곱한다. 2. 이렇게 곱한 각 자리의 수들을 모두 더한다. 3. 모두 더한 수를 11로 나눈 나머지를 구한다. 4. 이 나머지를
	 * 11에서 뺀다. 5. 이렇게 뺀 수가 두 자릿수이면, 즉 10보다 크면 다시 11로 나누어 나머지 값을 구한다. 6. 이렇게 해서
	 * 나온 최종 값을 주민등록번호의 마지막 자리 수와 비교해서 같으면 유효한 번호이고 다르면 잘못된 값이다.
	 * 
	 */

	var sum = 0;
	var sum2 = 0;
	var valid = 0;

	for (var i = 0; i < num1.value.length; i++) {
		sum += num1.value.substr(i, 1) * (i + 2);
		// Y1 *2
		// Y2 *3
		// M1 *4
		// M2 * 5
		// D1 * 6
		// D2 * 7
	}
	for (var j = 0; j < num2.value.length - 1; j++) {
		if (j < 2) {
			sum2 += num2.value.substr(j, 1) * (j + 8);
			// S1*8
			// N1 *9
		} else {
			sum2 += num2.value.substr(j, 1) * j;
			// N2 * 2
			// N3 * 3
			// N4 * 4
			// N5 *5
			// 마지막 번호는 제외
		}
	}

	valid = 11 - ((sum + sum2) % 11);

	if (valid > 10) {
		valid = valid % 10;
	}

	if (valid != num2.value.substr(6, 1)) {
		return false;
	} else {
		return true;
	}

}
function CheckID() { // 아이디 체크
	window.open("CheckID.html", "아이디 중복확인", "width=500, height=300");
}