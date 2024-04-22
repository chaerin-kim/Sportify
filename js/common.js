const API_KEY = '2dd305e2-d519-498d-991b-7aa9489893c1';
const Rows = 10; // 한 페이지에 표시할 항목의 수 (최대값)
const PageNum = 1; // 페이지 번호

const getLatestDatas = async () => {
  const url = new URL(
    `http://api.kcisa.kr/openapi/service/rest/meta2018/getKSPD0720184?serviceKey=${API_KEY}&numOfRows=${Rows}&pageNo=${PageNum}`
  );
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json', // Curl 부분 복붙
    },
  });

  const data = await response.json();
  // console.log('data 확인용 --- ', data);
  let sportsLists = data.response.body.items.item;
  // console.log('items 확인용 --- ', items);
  renderList(sportsLists);
};

const renderList = (sportsLists) => {
  console.log('sportsLists', sportsLists);
  const listHtml = sportsLists
    .map(
      (lists) => `
      <li class="sportsList">
      <div class="grayCon">
        <h5>${lists.title}</h5>
        <p>종목 :${lists.grade}</p>
        <p>요일 및 시간 :${lists.temporalCoverage}</p>
      </div>
      <a href="${lists.url}" class="more">자세히보기</a>
    </li>
    `
    )
    .join('');
  document.querySelector('.listCon > ul').innerHTML = listHtml;
};

getLatestDatas();
