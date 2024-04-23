const API_KEY = '2dd305e2-d519-498d-991b-7aa9489893c1';
const Rows = 10; // 한 페이지에 표시할 항목의 수 (최대값)
const PageNum = 1; // 페이지 번호

// 930px 이하일 때 footer .mw 클래스 제거
window.addEventListener('resize', function() {
  const footer = document.querySelector('footer');
  if (window.innerWidth <= 930) {
    footer.classList.remove('mw');
  } else {
    footer.classList.add('mw');
  }
});

//햄버거 토글방식
const hamIcon = document.querySelector('.ham');
const closeIcon = document.querySelector('.close');

hamIcon.addEventListener('click', function() {
  closeIcon.style.display = 'block';
  hamIcon.style.display = 'none';
});
closeIcon.addEventListener('click', function() {
  hamIcon.style.display = 'block';
  closeIcon.style.display = 'none';
});




//2. json 파일 객체 변환 및 에러 처리 함수
const fetchList = async (url) => {
  try {
    //fetch(위치, GET/POST)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json', 
      },
    });

    // json 파일을 잘 읽어왔는지  HTTP 응답 상태 코드를 통해 확인
    if (response.status !== 200) {
      throw new Error(`HTTP 오류: ${response.statusText}`);
    }
    const data = await response.json(); // 이후 json 파일을 객체로 변환
    let sportsLists = data.response.body.items.item;
    renderList(sportsLists); //객체들 출력!!!!
  } catch (error) {
    console.error(
      `[오류 발생] ${error.name}(에러 이름): ${error.message}(에러 메세지)`
    );
  }
};

//1.정보 처리
const getLatestDatas = async () => {
  const url = new URL(
    `http://api.kcisa.kr/openapi/service/rest/meta2018/getKSPD0720184?serviceKey=${API_KEY}&numOfRows=${Rows}&pageNo=${PageNum}`

  );
  await fetchList(url); // fetchList 함수가 완료될 때까지 기다림
};

// '요일 및 시간' 출력 형식 변경
function formatDays(schedule) {
  //알 수 없음인지 확인 필요
  if (schedule == '--알 수 없음--') {
    return schedule;
  } else {
    // 일단 요일과 시간을 구분하기
    const days = schedule.split(' ')[0];
    const time = schedule.split(' ')[1];
    // 요일 부분을 '월,화,수,목,금' 형식으로 변경
    const formatDays = days.split('').join(',');
    // createHtml 로 결과값 돌려주기
    return formatDays + ' / ' + time;
  }
}

// 정보가 없을 경우 처리방식
const createHtml = (lists) => {
  let title = lists.title || '--제목 없음--';
  let grade = lists.grade || '--알 수 없음--';
  let temporalCoverage = lists.temporalCoverage || '--알 수 없음--';
  let url = lists.url ? lists.url : 'javascript:void(0)';

  return `
  <li class="sportsList">
    <div class="grayCon">
      <h5>${title}</h5>
      <p>종목 : ${grade}</p>
      <p>요일 및 시간 : ${formatDays(temporalCoverage)}</p>
    </div>
    <a href="${url}" class="more" ${
    !lists.url ? 'onclick="alert(\'연결된 링크가 없습니다.\')"' : ''
  }>자세히보기</a>
  </li>
  `;
};

const renderList = (sportsLists) => {
  const listHtml = sportsLists.map((lists) => createHtml(lists)).join('');
  document.querySelector('.listCon > ul').innerHTML = listHtml;
};

getLatestDatas();
