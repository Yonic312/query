trans = class trans extends AView {

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

	// 거래내역 조회 버튼
	trade_search() {
		this.grid.removeAll();

		const cntrM = AContainer.findOpenContainer('TE2000').view;
		const gridM = cntrM.main_grid1;

		const next_key = 0;
		try {
			if (gridM.colIndexOfCell(gridM.getSelectedCells()[0]) == -1) {
				throw new Error('관리자를 선택해 주세요');
			}
			const acnt_cd = gridM.getCell(gridM.colIndexOfCell(gridM.getSelectedCells()[0]), 3).textContent;
			this.searchTrans(acnt_cd, next_key);
		} catch (e) {
			AToast.show(e.message);
		}
	}

	// 거래내역 조회 / TE3000
	searchTrans(acnt_cd, next_key) {
		this.grid.removeAll();
		const thisObj = this;

		theApp.qm.sendProcessByName( 'TE3000', this.getContainerId(), null,
			function (queryData) {
				const inblock1 = queryData.getBlockData('InBlock1')[0];
				console.log('inblock : ', inblock1);
				inblock1.acnt_cd = acnt_cd;
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
			}
		);
	}

	// 거래내역 다음버튼
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
			this.searchTrans(acnt_cd, next_key);
		} catch (e) {
			AToast.show(e.message);
		}
	}
}