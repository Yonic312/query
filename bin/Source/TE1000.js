
/*
* ADataMask 사용자 정의 파일
*/
if(!ADataMask.TE1000) ADataMask.TE1000 = {};
ADataMask.TE1000.selectNoticeType =
{
	title : "구분 설정",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function selectNoticeType(value, param, ele, dataObj)
	{
		// value: 마스킹 할 대상 값(query 를 등록했을 경우 매핑한 필드의 값이 넘어옴)
		// param: 마스크 등록 시 입력한 값이 배열로 넘어옴
		// ele: 마스크를 매핑한 엘리먼트
		// dataObj: 마스킹에 필요한 추가 데이터 (ADataGrid 에서 사용)
		// ADataMask.getQueryData() : [data, keyArr, queryData]
		// --> query 파일 매핑시, 매핑한 필드와 수신한 데이터를 위와 같이 얻어올 수 있다.

		// 리턴값이 마스킹 결과 값이 됨

        switch (value) {
            case '1' : value = '공지'; break;
            case '2' : value = '긴급'; break;
            case '3' : value = '뉴스'; break;
            case '4' : value = '시스템'; break;
        }

		return value;
	}
};
