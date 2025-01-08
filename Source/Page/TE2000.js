TE2000 = class TE2000 extends AView {
    constructor() {
        super();
    }

    init(context, evtListener) {
        super.init(context, evtListener);
    }

    onInitDone() {
        super.onInitDone();
    }

    onActiveDone(isFirst) {
        super.onActiveDone(isFirst);
        this.getManager();

        var cntr = AContainer.findOpenContainer('TE2000');
        console.log('cntr.getData : ', cntr);
        console.log('window.trans : ', global.trans);
    }

    // 관리자 조회 / TE2000
    getManager() {
        const thisObj = this;

        theApp.qm.sendProcessByName('TE2000', this.getContainerId(), null,
            function (queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
            },

            function (queryData) {
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

                for (let i = 0; i < outblock1.length; i++) {
                    thisObj.user_id.addItem(outblock1[i].user_id, outblock1[i].user_id);
                }
            }
        );
    }

    // 회원 조회 btn
    search_btn(comp, info, e) {
        this.main_grid1.removeAll();
        const thisObj = this;
        this.clickSearch(0);
    }

    // 회원목록 다음
    clickNext(comp, info, e) {
        console.log("colCount : ", this.main_grid1.getRowCount());
        if (this.main_grid1.getRowCount() === 0) {
            AToast.show('조회를 먼저 하세요');
        } else {
            try {
                const next_key = "next_key : " + "admin." + this.main_grid1.getCellText(this.main_grid1.getRowCount() - 1, 1);
                console.log(next_key);
                this.main_grid1.removeAll();
                this.clickSearch(this.nextBtn.data);
            } catch (e) {
                console.log(e);
            }
        }
    }

    // 회원목록 조회 / TE2010
    clickSearch(next_key) {
        const thisObj = this;

        theApp.qm.sendProcessByName('TE2010', this.getContainerId(), null,
            function (queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.next_key = next_key;
            },

            function (queryData) {
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
                thisObj.nextBtn.setData(outblock1[outblock1.length - 1].next_key);
            },

            function (queryData) {
                // afterOutBlockData
                const outblock1 = queryData.getBlockData('OutBlock1');
                outblock1.forEach((row, rowIndex) => {
                    if (row.used_yn === 'N') {
                        const columnCount = thisObj.main_grid1.getColumnCount();
                        for (let colIndex = 0; colIndex < columnCount; colIndex++) {
                            thisObj.main_grid1.setCellTextColor(rowIndex, colIndex, '#FF0000');
                        }
                    }
                });
            }
        );
    }
}