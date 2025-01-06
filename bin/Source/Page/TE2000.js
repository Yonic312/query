
TE2000 = class TE2000 extends AView
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

		this.getManager();

        var cntr = AContainer.findOpenContainer('TE2000');
        console.log('cntr.getData : ',cntr);
        console.log('window.trans : ',global.trans);
	}

    // 회원 조회
	search_btn(comp, info, e){   
        this.main_grid1.removeAll();
        const thisObj = this;
        const user_id = this.user_id.getData();
        const search = this.search.getText();
        console.log("user_id : ", user_id, " search : ", search);
        
        // 전체 검색
        if(user_id==0 && search==''){
            console.log('기본')
            // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
        theApp.qm.sendProcessByName(
            'TE2010', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
            this.getContainerId(), // 현재 화면의 컨테이너 ID
            null, // 추가 데이터 (여기서는 null로 전달)
            
            // 1. InBlock 설정 (서버로 보낼 데이터 설정)
            function(queryData) {
                // 서버에 전송할 데이터를 `InBlock1`에 설정
                const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
                inblock1.user_id = user_id;
                inblock1.search = thisObj.search.getText();
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

                // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
                console.log(outblock1[0].member_id, outblock1[0].member_name, outblock1[0].acnt_cd, outblock1[0].deposit_amt, outblock1[0].used_yn);
                // thisObj.getContainer().close(true, outblock1[0]); // 결과 데이터를 반환하며 화면 종료
                console.log(outblock1);
            }
        );
        } else{
             console.log('기본x')
            // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
        theApp.qm.sendProcessByName(
            'TE2010', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
            this.getContainerId(), // 현재 화면의 컨테이너 ID
            null, // 추가 데이터 (여기서는 null로 전달)
            
            // 1. InBlock 설정 (서버로 보낼 데이터 설정)
            function(queryData) {
                // 서버에 전송할 데이터를 `InBlock1`에 설정
                const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
                inblock1.user_id = user_id;
                inblock1.search = search;
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

                // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
                console.log(outblock1[0].member_id, outblock1[0].member_name, outblock1[0].acnt_cd, outblock1[0].deposit_amt, outblock1[0].used_yn);
                // thisObj.getContainer().close(true, outblock1[0]); // 결과 데이터를 반환하며 화면 종료
                

                console.log("outblock1[0].member_id : " + outblock1[0].member_id);
            }
        );
        }
	}
    
    // 1.관리자 조회
    getManager(){
        const thisObj = this;
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE2000', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
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

            // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
            console.log("조회 : ",queryData);
            //console.log(queryData.length);

            for(let i=0; i<outblock1.length;i++){
                thisObj.user_id.addItem(outblock1[i].user_id,outblock1[i].user_id);
            }
        }
    );
    };

    // 작업중
	// async trade_search(comp, info, e)	{
    // //console.log('trans : ',_trans.getContainer());
    // const selectTab = await this.tabView.selectTabById('s1');
    // console.log('비동기 : ', this.tabView.selectTabById('s1'));
    // selectTab.view.grid.removeAll(); // Promise 객체이다
                
    // console.log('this.grid.main1 : ', this.main_grid1);
    // const option = this.select_option.getData();
    // const acnt_cd = this.main_grid1.getCell(this.main_grid1.colIndexOfCell(this.main_grid1.getSelectedCells()[0]),3).textContent;
    // const start_date = this.start_date.getDateString();
    // const end_date = this.end_date.getDateString();
    // const thisObj = this;
    //     // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    //     theApp.qm.sendProcessByName(
    //         'TE3000', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
    //         this.getContainerId(), // 현재 화면의 컨테이너 ID
    //         null,

    //         // 1. InBlock 설정 (서버로 보낼 데이터 설정)
    //         function(queryData) {
    //             // 서버에 전송할 데이터를 `InBlock1`에 설정
    //             const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
    //             inblock1.acnt_cd = acnt_cd; 
    //             inblock1.ord_action = option;
    //             inblock1.start_date = start_date;
    //             inblock1.end_date = end_date;
    //         },
            
    //         // 2. OutBlock 처리 (서버 응답 데이터 처리)
    //         function(queryData) { // async 추가!! (await)
    //             // 처리 중 발생한 에러 데이터를 가져옵니다.
    //             const errorData = this.getLastError();
    //             if (errorData.errFlag == "E") { // 에러가 발생한 경우
    //                 console.log("Error Data:", errorData); // 에러 데이터를 콘솔에 출력
    //                 AToast.show('에러가 발생했습니다.'); // 사용자에게 에러 메시지를 표시
    //                 return;
    //             }
                
    //             // 서버로부터 받은 결과 데이터 (`OutBlock1`)를 가져옵니다.
    //             const outblock1 = queryData.getBlockData('OutBlock1');
                
    //             // 조회된 데이터가 없는 경우 경고 메시지를 표시
    //             if (!outblock1 || outblock1.length <= 0) {
    //                 AToast.show('조회된 데이터가 없습니다.');
    //                 return;
    //             }
                
                
                


    //             // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
    //             console.log(outblock1[0].biz_date);
    //         }
    //     );
	// }
}