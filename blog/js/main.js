const POSTS_PER_PAGE = 6;
let currentPage = 1;
let posts = [];

async function fetchPosts() {
  const res = await fetch('articles/index.json');
  posts = await res.json();
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  renderLatestPost();
  renderCarousel();
  renderPaginatedPosts();
}

function renderLatestPost() {
  const latest = posts[0];
  const container = document.getElementById('latest-container');
  container.innerHTML = `<a href="post.html?slug=${latest.slug}" class="block bg-white shadow p-4 rounded">
    <img src="${latest.image}" alt="${latest.title}" class="mb-4 w-full h-48 object-cover">
    <h3 class="text-xl font-semibold">${latest.title}</h3>
    <p class="text-sm text-gray-600">${latest.date}</p>
    <p>${latest.summary}</p>
  </a>`;
}

function renderCarousel() {
  const container = document.getElementById('carousel-container');
  //const latest = posts.slice(1, 6);
  const latest = posts.slice(1, POSTS_PER_PAGE);
  container.innerHTML = latest.map(post => `
    <a href="post.html?slug=${post.slug}" class="min-w-[250px] bg-white shadow p-4 rounded">
      <img src="${post.image}" alt="${post.title}" class="mb-2 w-full h-32 object-cover">
      <h3 class="text-lg font-semibold">${post.title}</h3>
    </a>
  `).join('');
}

function renderPaginatedPosts() {
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginated = posts.slice(start, end);
  document.getElementById('posts-container').innerHTML = paginated.map(post => `
    <a href="post.html?slug=${post.slug}" class="block bg-white shadow p-4 rounded">
      <img src="${post.image}" alt="${post.title}" class="mb-2 w-full h-40 object-cover">
      <h3 class="text-lg font-semibold">${post.title}</h3>
      <p class="text-sm text-gray-600">${post.date}</p>
      <p>${post.summary}</p>
    </a>
  `).join('');

  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = Array.from({ length: pageCount }, (_, i) => `
    <button onclick="goToPage(${i + 1})" class="px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}">
      ${i + 1}
    </button>
  `).join('');
}

function goToPage(page) {
  currentPage = page;
  renderPaginatedPosts();
}

window.onload = fetchPosts;
