const API_KEY = '2dd305e2-d519-498d-991b-7aa9489893c1';
const Rows = 16; // 한 페이지에 표시할 항목의 수 (최대값)
let PageNum = 1; // 페이지 번호

let sportsLists = [];
let totalResults = 0;
let pageSize = Rows;
let page = PageNum;
let groupSize = 5;

window.addEventListener('resize', function () {
  const footer = document.querySelector('footer');
  if (window.innerWidth <= 930) {
    footer.classList.remove('mw');
  } else {
    footer.classList.add('mw');
  }
});

const hamIcon = document.querySelector('.ham');
const closeIcon = document.querySelector('.close');
const gnb = document.querySelector('.gnb');

hamIcon.addEventListener('click', function () {
  closeIcon.style.display = 'block';
  hamIcon.style.display = 'none';
  gnb.classList.add('active');
});

closeIcon.addEventListener('click', function () {
  hamIcon.style.display = 'block';
  closeIcon.style.display = 'none';
  gnb.classList.remove('active');
});



//페이지네이션
const moveToPage = async (pageNum) => {
  page = pageNum;
  const url = new URL(
    `http://api.kcisa.kr/openapi/service/rest/meta2018/getKSPD0720184?serviceKey=${API_KEY}&numOfRows=${Rows}&pageNo=${page}`
  );
  await fetchList(url);

  // 페이지 이동하고, 스르륵! 움직이게
  const targetElement = document.getElementById('target');
  targetElement.scrollIntoView({ behavior: 'smooth' });

};

const pagination = () => {
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;
  let totalGroup = Math.ceil(totalResults / pageSize);

  let paginationHtml = `<button class="prev"><i class="fa-solid fa-angle-left"></i></button>`;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<span id="scrollButton" class="page-item ${
      i == page ? 'on' : ''
    }" onclick="moveToPage(${i})">${i}</span>`;
  }
  paginationHtml += `<button class="next"><i class="fa-solid fa-angle-right"></i></button>`;

  document.querySelector('.pgCon').innerHTML = paginationHtml;

  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  // .next 버튼 클릭 시 이동
  document.querySelector('.next').addEventListener('click', function () {
    if (pageGroup < totalGroup && lastPage == page) {
      moveToPage(lastPage + 1);
    } else {
      moveToPage(page + 1);
    }
  });

  // .prev 버튼 클릭 시 이동
  document.querySelector('.prev').addEventListener('click', function () {
    if (pageGroup > 1 && firstPage == page) {
      moveToPage(firstPage - 1);
    } else {
      moveToPage(page - 1);
    }
  });

  // 현재 페이지가 1번이면 .prev 버튼 숨기기
  if (page === 1) {
    prevButton.style.display = 'none';
  } else {
    prevButton.style.display = 'inline-block';
  }

  // 현재 페이지가 마지막 페이지면 .next 버튼 숨기기
  if (lastPage === totalResults) {
    nextButton.style.display = 'none';
  } else {
    nextButton.style.display = 'inline-block';
  }
};

pagination(); // 페이지 네비게이션 초기 렌더링

const fetchList = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP 오류: ${response.statusText}`);
    }
    const data = await response.json();
    totalResults = data.response.body.totalCount;
    sportsLists = data.response.body.items.item;
    renderList(sportsLists);
    pagination();
  } catch (error) {
    console.error(
      `[오류 발생] ${error.name}(에러 이름): ${error.message}(에러 메세지)`
    );
  }
};

const getLatestDatas = async () => {
  const url = new URL(
    `http://api.kcisa.kr/openapi/service/rest/meta2018/getKSPD0720184?serviceKey=${API_KEY}&numOfRows=${Rows}&pageNo=${PageNum}`
  );
  await fetchList(url);
};

function formatDays(schedule) {
  if (schedule == '--알 수 없음--') {
    return schedule;
  } else {
    const days = schedule.split(' ')[0];
    const time = schedule.split(' ')[1];
    const formatDays = days.split('').join(',');
    return formatDays + ' / ' + time;
  }
}

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
  }>선택</a>
  </li>
  `;
};

const renderList = (sportsLists) => {
  const listHtml = sportsLists.map((lists) => createHtml(lists)).join('');
  document.querySelector('.listCon > ul').innerHTML = listHtml;
};

getLatestDatas();


