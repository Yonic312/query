
Login = class Login extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

	onLoginBtnClick(comp, info, e)
	{
        const thisObj = this;

    // 사용자로부터 입력받은 아이디와 비밀번호 값을 가져옵니다.
    const userId = this.userId.getText();
    const userPw = this.userPw.getText();

    // 아이디 또는 비밀번호가 입력되지 않은 경우, 경고 메시지를 표시하고 종료합니다.
    if (!userId || !userPw) return AToast.show('아이디 또는 비밀번호를 입력해주세요.');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE0000', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.user_id = userId; // 사용자 ID를 설정
            inblock1.user_pw = CryptoJS.SHA256(userPw).toString(); // 비밀번호를 SHA-256으로 해싱하여 설정
        },
        
        // 2. OutBlock 처리 (서버 응답 데이터 처리)
        function(queryData) {
            // 처리 중 발생한 에러 데이터를 가져옵니다.
            const errorData = this.getLastError();
            if (errorData.errFlag == "E") { // 에러가 발생한 경우
                console.log("Error Data:", errorData); // 에러 데이터를 콘솔에 출력
                AToast.show('에러가 발생했습니다.'); // 사용자에게 에러 메시지를 표시
                return;
            }
            
            // 서버로부터 받은 결과 데이터 (`OutBlock1`)를 가져옵니다.
            const outblock1 = queryData.getBlockData('OutBlock1');
            
            // 조회된 데이터가 없는 경우 경고 메시지를 표시
            if (!outblock1 || outblock1.length <= 0) {
                AToast.show('조회된 데이터가 없습니다.');
                return;
            }

            // 서버에서 성공 여부를 나타내는 `success_status` 필드를 확인
            if (outblock1[0].success_status !== 'Y') {
                AToast.show('아이디 또는 비밀번호를 확인해주세요.'); // 로그인 실패 메시지 표시
                return;
            }

            // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
            console.log(outblock1[0]);
            thisObj.getContainer().close(true, outblock1[0]); // 결과 데이터를 반환하며 화면 종료
        }
    );
	}

	onLoginKeyup(comp, info, e)
	{
        if ( e.key === 'Enter' ) this.onLoginBtnClick();
	}

	onRegisterBtnClick(comp, info, e)
	{
        const loginWin = new AWindow();
        loginWin.openCenter('Source/Window/Register.lay', null, 720, 480);
        loginWin.setResultCallback((flag, data) => {
            if ( !flag ) return;
            
            AToast.show('회원가입 성공!');
        });
	}
};

