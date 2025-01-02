
TE1000 = class TE1000 extends AView
{
	constructor()
	{
		super()

		this.contiKey = '';
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		this.createCkEditor(this.noticeContent.element);
	}

	onInitDone()
	{
		super.onInitDone()
      
	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		this.searchList(
            0,
             this.top_start_date.getDateString(),
             this.top_end_date.getDateString(),
             0
        )

	}

    createCkEditor(target)
    {
        return ClassicEditor.create(target, {
            language: 'ko',
            extraPlugins: [customUploadAdapterPlugin],
        })
        .then(editor => {
            editor.editing.view.change(writer => writer.setStyle('height', '200px', editor.editing.view.document.getRoot()))
            this.noticeContent = editor;
        })
        .catch(console.error);

        function customUploadAdapterPlugin(editor) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new UploadAdapter(loader, `${config.SERVER_ADDRESS}:${config.SERVER_PORT}/upload`);
            };
        }
    }

	add_button(comp, info, e){

        // console.log("title :  ",this.notice_title.getText());
        // console.log("content :  ",this.noticeContent.getData());
        // console.log("type :  ",this.notice_type.getSelectedIndex());
        
        const thisObj = this;

    // 사용자로부터 입력받은 아이디와 비밀번호 값을 가져옵니다.
    const title = this.notice_title.getText();
    const content = this.noticeContent.getData();
    const type = this.notice_type.getSelectedIndex()+1;

    // 아이디 또는 비밀번호가 입력되지 않은 경우, 경고 메시지를 표시하고 종료합니다.
    if (!title || !content || !type) return AToast.show('빈 값들을 입력해주세요.');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE1011', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.notice_title = title; // 사용자 ID를 설정
            inblock1.notice_content = content;
            inblock1.notice_type = type;
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
                AToast.show('글 작성을 실패했습니다!'); // 로그인 실패 메시지 표시
                return;
            }

            // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
            console.log(outblock1[0]);
            // thisObj.getContainer().close(true, outblock1[0]); // 결과 데이터를 반환하며 화면 종료
        }
    );
	}

    // 값 하나 가져오기
    onMain_gridSelect(comp, info, e)
	{

        console.log((this.main_grid.colIndexOfCell(this.main_grid.getSelectedCells()[0])));
        const selectGrid = this.main_grid.colIndexOfCell(this.main_grid.getSelectedCells()[0]);
        const index = this.main_grid.getCell(selectGrid,0).textContent;

        console.log("index : " + index);


        // console.log(this.main_grid.getCell(selectGrid,1));
        // console.log(this.main_grid.getCell(selectGrid,2));
        const thisObj = this;

    if (selectGrid == null) return AToast.show('index가 선택되지 않았습니다');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE1010', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.notice_id = index;
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
            console.log("선택 조회 : ",queryData);
            thisObj.notice_index.setText(outblock1[0].notice_id);
            thisObj.notice_title.setText(outblock1[0].notice_title);
            thisObj.noticeContent.setData(outblock1[0].notice_content);

            
        }
    );
	}

    // 조회
	search_button(comp, info, e) {        

        console.log('notice type : ',this.top_notice_type.getData())
        
    	this.searchList(
            this.top_notice_type.getData(),
            this.top_start_date.getDateString(),
            this.top_end_date.getDateString()
        )
	}

    searchList(type, start_date, end_date, next_key){
        this.main_grid.removeAll();
        this.main_grid.removeAll(); 

        const thisObj = this;
        console.log("함수 타입 : ", type);

    // 아이디 또는 비밀번호가 입력되지 않은 경우, 경고 메시지를 표시하고 종료합니다.
    if (!start_date || !end_date) return AToast.show('목록을 선택하세요');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE1000', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.notice_type = type;        
            inblock1.start_date = start_date;
            inblock1.end_date = end_date;
            inblock1.next_key = next_key;

            console.log("next : " , inblock1.next_key);
            console.log("inblock : ",inblock1);
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
            console.log("q : ",queryData);
            //console.log(queryData.length);

            for(let i=0; i < outblock1.length; i++){
                var data = [
                outblock1[i].notice_id,
                outblock1[i].notice_title,
                outblock1[i].notice_content,
                outblock1[i].notice_type,
                outblock1[i].notice_date
                ];
            thisObj.main_grid.addRow(data);
            }
            console.log(queryData);
        }
    );
    }
    
    // 삭제
	delete_button(comp, info, e)
	{
        // index값 가져오기
		console.log(this.notice_index.getText());

        const thisObj = this;

        const index = this.notice_index.getText();

    // 아이디 또는 비밀번호가 입력되지 않은 경우, 경고 메시지를 표시하고 종료합니다.
    if (!this.notice_index.getText()) return AToast.show('index가 선택되지 않았습니다');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE1013', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.notice_id = index;
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
                 AToast.show('삭제를 실패했습니다!');
                 return;
             }

            // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
            console.log("삭제 : ",queryData);
            //console.log(queryData.length);
        }
    );

    this.searchList(
            thisObj.notice_type.getData(),
             this.top_start_date.getDateString(),
             this.top_end_date.getDateString()
        )
	}
    

	
    // 수정
	edit_button(comp, info, e)
	{
        console.log(this.notice_index.getText());
		console.log(this.notice_type.getData());
        console.log(this.notice_title.getText());
        console.log(this.noticeContent.getData());



        // index값 가져오기
		console.log(this.notice_index.getText());

        const thisObj = this;

        const index = this.notice_index.getText();

    // 아이디 또는 비밀번호가 입력되지 않은 경우, 경고 메시지를 표시하고 종료합니다.
    if (!this.notice_index.getText()) return AToast.show('index가 선택되지 않았습니다');
    
    // 서버로 데이터를 전송하고 응답을 처리하는 메서드 호출
    theApp.qm.sendProcessByName(
        'TE1012', // 서버에서 정의된 프로세스 이름 (쿼리 이름!)
        this.getContainerId(), // 현재 화면의 컨테이너 ID
        null, // 추가 데이터 (여기서는 null로 전달)
        
        // 1. InBlock 설정 (서버로 보낼 데이터 설정)
        function(queryData) {
            // 서버에 전송할 데이터를 `InBlock1`에 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0]; // `InBlock1`은 서버와 약속된 데이터 구조 (서버로 보낼 데이터 블록 가져오기!)
            inblock1.notice_id = thisObj.notice_index.getText();
            inblock1.notice_title = thisObj.notice_title.getText();
            inblock1.notice_content = thisObj.noticeContent.getData();
            inblock1.notice_type = thisObj.notice_type.getData();
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
                 AToast.show('수정을 실패했습니다!');
                 return;
             }

            // 로그인 성공 시, 결과 데이터를 콘솔에 출력하고 화면을 닫습니다.
            console.log("수정 : ",queryData);
            //console.log(queryData.length);
        }
    );

    this.searchList(
            thisObj.notice_type.getData(),
             this.top_start_date.getDateString(),
             this.top_end_date.getDateString()
        )
	}

	next_btn(comp, info, e)
	{

		console.log('다음');
        console.log(this.main_grid.getCell(29,0).textContent);


        this.searchList(
             0,
              this.top_start_date.getDateString(),
              this.top_end_date.getDateString(),
              this.main_grid.getCell(29,0).textContent
         )

	}
}