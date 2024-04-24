const hamBtn = document.querySelector('.ham');
const nav = document.querySelector('header > nav');
const newsBord = document.querySelector('.listCon');
const searchBtn = document.querySelector('.searchBtn');
const searchInput = document.querySelector('.inpurArea input');

const API_KEY = '93df3e503d2641938840098a9b2e8500';

let newsList = [];
let totalResults = 0;
let pageSize = 6; //Rows
let page = 1;
let groupSize = 10;

hamBtn.addEventListener('click', () => {
  nav.classList.toggle('on');
});

const moveToPage = async (pageNum, category) => {
  page = pageNum;
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?&apiKey=${API_KEY}&category=${category}`
  );
  await fetchNews(url, category);
};

const pagination = (category) => {
  // console.log('카테고리 확인 ---', category);
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;

  let paginationHtml = `<button class="prev"><i class="fa-solid fa-arrow-left"></i></button>`;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += 
    `<button class="${i == page ? 'on' : '' }" onclick="moveToPage(${i}, '${category}')">${i}</button>`;
  }
  paginationHtml += `<button class="next"><i class="fa-solid fa-arrow-right"></i></button>`;

  document.querySelector('.pgcon').innerHTML = paginationHtml;
};

const errorRender = (message) => {
  const errorHtml = `<li class="nolist">일시적문제 ^^ ${message}</li>`;
  newsBord.innerHTML = errorHtml;
};

const fetchNews = async (url, category = 'general') => {
  try {
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('page', page);
    url.searchParams.append('category', category);
    url.searchParams.append('country', 'kr');

    const response = await fetch(url);
    const data = await response.json();
    console.log(url);
    totalResults = data.totalResults;

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    newsList = data.articles;
    renderNews(newsList);
    pagination(category);
  } catch (error) {
    errorRender(error.message);
  }
};

const searchFn = () => {
  const searchWord = searchInput.value;
  searchInput.value = '';
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?q=${searchWord}&pageSize=${pageSize}&apiKey=${API_KEY}`
  );
  fetchNews(url);
};

const getNewsByCate = async (category) => {
  page = 1;
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`
  );
  fetchNews(url, category);
};

const createHtml = (news) => {
  let urlToImage = news.urlToImage ? news.urlToImage : '../img/noimg.png';
  let title = news.title || '제목없음';
  let description = news.description
    ? news.description.length > 100
      ? news.description.substring(0, 100) + '...'
      : news.description
    : '내용 없음';

  let source = news.source ? news.source.name || '출처없음' : '출처없음';
  let author = news.author || '작성자없음';
  let publishedAt = news.publishedAt
    ? new Date(news.publishedAt).toISOString().slice(0, 10)
    : '';

  return `
      <li>
          <div class="newsImg">
            <img
              src="${urlToImage}"
              alt="${title}"
              onerror="this.onerror=null; this.src='./img/noimg.png';"
            />
          </div>
          <p class="newsTitle">${title}</p>
          <p class="desc">${description}</p>
          <span class="source">${source} / ${author}</span>
          <span class="date">${publishedAt}</span>
          <a
            class="more"
            href="${news.url}"
            >자세히보기</a
          >
      </li>
    `;
};

const renderNews = (newsList) => {
  if (newsList.length == 0) {
    newsBord.innerHTML = `<li class='nolist'>검색결과가 없습니다.</li>`;
    return;
  }
  const newsHtml = newsList.map((news) => createHtml(news)).join('');
  newsBord.innerHTML = newsHtml;
};

const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?&apiKey=${API_KEY}`
  );
  fetchNews(url);
};

nav.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  let category = e.target.dataset.cate;
  category = category.toLowerCase();
  getNewsByCate(category);
});

searchBtn.addEventListener('click', async () => {
  searchFn();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  searchFn();
});

getLatestNews();
