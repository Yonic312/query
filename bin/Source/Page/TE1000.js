
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

		this.searchList();

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

    // ----------------------------------------------------------------
    
    // 조회 / TE1000
	search_button(comp, info, e) {        
        console.log('notice type : ',this.top_notice_type.getData());
        
    	this.searchList();
	}

    // 글 하나 가져오기 / TE1010
    onMain_gridSelect(comp, info, e) {
        const getRow = comp.getRowIndexByInfo(info);
        console.log('getCell : ', this.main_grid.getCell(getRow, 0).textContent);
        const getValue = this.main_grid.getCell(getRow, 0).textContent;

        const thisObj = this;
        theApp.qm.sendProcessByName( 'TE1010', this.getContainerId(), null,

            function(queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.notice_id = getValue;
            },
            
            function(queryData) {
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                
                const outblock1 = queryData.getBlockData('OutBlock1');
                
                if (!outblock1 || outblock1.length <= 0) {
                    AToast.show('조회된 데이터가 없습니다.');
                    return;
                }

                console.log("선택 조회 : ",queryData);
                thisObj.noticeContent.setData(outblock1[0].notice_content);               
            }
        );
	}

    // 추가 / TE1011
	add_button(comp, info, e){
        const title = this.notice_title;
        const content = this.noticeContent;
        const type = this.notice_type;
        const index = this.notice_index;

        if(this.notice_index.getText() !== ''){
            this.resetInput();
            AToast.show('값을 다시 입력하세요');
        }else{
            console.log('no');
            const thisObj = this;
            if (!title.getText() || !content.getData() || !type.getData()) return AToast.show('빈 값들을 입력해주세요.');
            
            theApp.qm.sendProcessByName( 'TE1011', this.getContainerId(), null,
                
                function(queryData) {
                    const inblock1 = queryData.getBlockData('InBlock1')[0];
                    inblock1.notice_content = content.getData();
                },
                
                function(queryData) {
                    const errorData = this.getLastError();
                    if (errorData.errFlag == "E") {
                        console.log("Error Data:", errorData);
                        AToast.show('에러가 발생했습니다.');
                        return;
                    }
                    
                    const outblock1 = queryData.getBlockData('OutBlock1');
                    
                    if (!outblock1 || outblock1.length <= 0) {
                        AToast.show('조회된 데이터가 없습니다.');
                        return;
                    }

                    if (outblock1[0].success_status !== 'Y') {
                        AToast.show('글 작성을 실패했습니다!');
                        return;
                    }
                    console.log(outblock1[0]);
                    thisObj.searchList();
                    thisObj.resetInput();
                }
            );
        }
	}

    // 수정 / TE1012
	edit_button(comp, info, e) {
        const thisObj = this;

        theApp.qm.sendProcessByName( 'TE1012', this.getContainerId(), null, 
            
            function(queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.notice_content = thisObj.noticeContent.getData();
            },
            
            function(queryData) {
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                
                const outblock1 = queryData.getBlockData('OutBlock1');
                
                if (!outblock1 || outblock1.length <= 0) {
                    AToast.show('조회된 데이터가 없습니다.');
                    return;
                }

                if (outblock1[0].success_status !== 'Y') {
                    AToast.show('수정을 실패했습니다!');
                    return;
                }

                thisObj.searchList();
                thisObj.resetInput();
            }
        );
	}

    // 삭제 / TE1013
	delete_button(comp, info, e) {
    const thisObj = this;
        theApp.qm.sendProcessByName( 'TE1013', this.getContainerId(), null, 

            function(queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
            },
            
            function(queryData) {
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                
                const outblock1 = queryData.getBlockData('OutBlock1');

                if (!outblock1 || outblock1.length <= 0) {
                    AToast.show('조회된 데이터가 없습니다.');
                    return;
                }

                if (outblock1[0].success_status !== 'Y') {
                    AToast.show('삭제를 실패했습니다!');
                    return;
                }

                thisObj.searchList();
                thisObj.resetInput();
            }
        );
	}

	next_btn(comp, info, e) {
        this.searchList(this.nextBtn.data);
	}

    // 검색함수
    searchList(next_key){
        const thisObj = this;
        this.main_grid.removeAll();
    
        theApp.qm.sendProcessByName( 'TE1000', this.getContainerId(), null,            
            function(queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.next_key = next_key;
            },
            
            function(queryData) {
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") { 
                    console.log("Error Data:", errorData); 
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                
                const outblock1 = queryData.getBlockData('OutBlock1');
                
                if (!outblock1 || outblock1.length <= 0) {
                    AToast.show('조회된 데이터가 없습니다.');
                    return;
                }
               
                thisObj.nextBtn.setData(outblock1[outblock1.length-1].next_key);
            }
        );
    }
    
    // 초기화
    resetInput (){
        
            this.notice_type.selectItem(0);
            this.notice_title.setText('');
            this.notice_index.setText('');
            this.noticeContent.setData('');
    }
}