
trans = class trans extends AView
{   
    
	constructor()
	{
		super()
    }

    

	init(context, evtListener)
	{
		super.init(context, evtListener)
        

	}

	onInitDone()
	{
		super.onInitDone()
	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
	}

	trade_search() {
        this.grid.removeAll(); // Promise 객체이다

        const cntrM = AContainer.findOpenContainer('TE2000').view;
        const getGrid = cntrM.main_grid1;

        const start_date = cntrM.start_date.getDateString();
        const end_date = cntrM.end_date.getDateString();
        const acnt_cd = getGrid.getCell(getGrid.colIndexOfCell(getGrid.getSelectedCells()[0]),3).textContent;
        const option = this.select_option.getData();
        const next_key = 0;

        console.log('next_key :', next_key);
        console.log('acnt_cd : ', acnt_cd);
        console.log('start_date : ', start_date);
        console.log('end_date : ', end_date);
        console.log('option : ', option);

        this.searchTrans(acnt_cd, option, start_date, end_date, next_key);
    }

    clickNext(comp, info, e)
	{
        const cntrM = AContainer.findOpenContainer('TE2000').view;
        const getGrid = cntrM.main_grid1;

        const start_date = cntrM.start_date.getDateString();
        const end_date = cntrM.end_date.getDateString();
        const acnt_cd = getGrid.getCell(getGrid.colIndexOfCell(getGrid.getSelectedCells()[0]),3).textContent;
        const option = this.select_option.getData();

        const selectedCell = this.grid.getCell(getGrid.colIndexOfCell(getGrid.getSelectedCells()[29]), -1);
        const next_key = selectedCell && selectedCell.textContent !== undefined ? selectedCell : 0;

        

        if(next_key){
            console.log('@@next_key :', next_key);
            console.log('acnt_cd : ', acnt_cd);
            console.log('start_date : ', start_date);
            console.log('end_date : ', end_date);
            console.log('option : ', option);

            this.grid.removeAll(); // Promise 객체이다
            this.searchTrans(acnt_cd, option, start_date, end_date, next_key);
        }

        
		

	}


    searchTrans(acnt_cd, option, start_date, end_date, next_key){
        const thisObj = this;
        // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
        theApp.qm.sendProcessByName(
            'TE3000', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
            this.getContainerId(), // 현재 화면의 컨테이너 ID
            null,

            // 1. InBlock 설정 (서버로 보낼 데이터 설정)
            function(queryData) {
                // 서버에 전송할 데이터를 `InBlock1`에 설정
                const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
                inblock1.acnt_cd = acnt_cd; 
                inblock1.ord_action = option;
                inblock1.start_date = start_date;
                inblock1.end_date = end_date;
                inblock1.next_key = next_key;
            },
            
            // 2. OutBlock 처리 (서버 응답 데이터 처리)
            function(queryData) { // async 추가!! (await)
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
                // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
                console.log(outblock1[0].biz_date);
            }
        );
    }
}