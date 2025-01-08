log = class log extends AView {

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
    }

    // 로그 조회 버튼
    clickSearch(comp, info, e) {
        const cntrM = AContainer.findOpenContainer('TE2000').view;
        const gridM = cntrM.main_grid1;

        const next_key = 0;
        try {
            if (gridM.colIndexOfCell(gridM.getSelectedCells()[0]) == -1) {
                throw new Error('관리자를 선택해 주세요');
            }
            const acnt_cd = gridM.getCell(gridM.colIndexOfCell(gridM.getSelectedCells()[0]), 3).textContent;
            this.searchLog(acnt_cd, next_key);
        } catch (e) {
            AToast.show(e.message);
        }
    }

    // 로그 조회 / TE3010
    searchLog(acnt_cd, next_key) {
        this.grid.removeAll();
        const thisObj = this;

        theApp.qm.sendProcessByName( 'TE3010', this.getContainerId(), null,
            function (queryData) {
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.acnt_cd = acnt_cd;
                inblock1.next_key = next_key;
            },

            function (queryData) {
                const errorData = this.getLastError();
                if (errorData.errFlag === "E") {
                    console.log("Error Data: ", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }

                const outblock1 = queryData.getBlockData('OutBlock1');
                if (!outblock1 || outblock1.length <= 0) {
                    AToast.show('조회된 데이터가 없습니다.');
                    return;
                }

                console.log(outblock1[0].biz_date);
                thisObj.nextBtn.setData(outblock1[outblock1.length - 1].next_key);
            }
        );
    }

    // 로그 조회 다음 버튼
    clickNext(comp, info, e) {
        const cntrM = AContainer.findOpenContainer('TE2000').view;
        const gridM = cntrM.main_grid1;

        const next_key = this.nextBtn.data;
        try {
            if (gridM.colIndexOfCell(gridM.getSelectedCells()[0]) == -1) {
                throw new Error('관리자를 선택해 주세요');
            } else if (next_key === undefined) {
                throw new Error('데이터를 조회해 주세요');
            }
            const acnt_cd = gridM.getCell(gridM.colIndexOfCell(gridM.getSelectedCells()[0]), 3).textContent;
            this.searchLog(acnt_cd, next_key);
        } catch (e) {
            AToast.show(e.message);
        }
    }
}