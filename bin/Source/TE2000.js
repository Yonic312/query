
/*
* ADataMask 사용자 정의 파일
*/
if(!ADataMask.TE2000) ADataMask.TE2000 = {};
ADataMask.TE2000.sellBuy =
{
	title : "매도매수구분 설명",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function funcName(value, param, ele, dataObj)
	{
		switch (value) {
            case '1' : value = '매도'; break;
            case '2' : value = '매수'; break;
        }

		return value;
	}
};

ADataMask.TE2000.ordType =
{
	title : "호가유형",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function ordType(value, param, ele, dataObj)
	{
		switch (value) {
            case '1' : value = '시장가'; break;
            case '2' : value = '지정가'; break;
        }

		return value;
	}
};

ADataMask.TE2000.ord_action =
{
	title : "신규정정취소구분",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function ord_action(value, param, ele, dataObj)
	{
		switch (value) {
            case '1' : value = '신규'; break;
            case '2' : value = '정정'; break;
            case '3' : value = '취소'; break;
        }

		return value;
	}
};

ADataMask.TE2000.usedYn =
{
	title : "신규정정취소구분",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function usedYn(value, param, ele, dataObj)
	{
		switch (value) {
            case 'Y' : value = '사용'; break;
            case 'N' : value = '미사용'; break;
        }

		return value;
	}
};