let _pages;
let _searchEngine;
let sortOrder = 1;

function pagesRefer(pages, searchEngine) {
  _pages = pages;
  _searchEngine = searchEngine;
}

function initPage() {
  loadCards();
  setupSearch();
  setupSort();
  document.getElementById('btn-search').click();
}

function loadCards() {
  let holder = document.getElementById("cardholder");
  holder.innerHTML = "";
  let pageIds = _searchEngine.orderPages(sortBy());
  pageIds.forEach(function(pid) {
    let aCard = document.createElement('page-card');
    aCard.id = pid;
    holder.append(aCard);
  });
}

function setupSearch() {
  document.getElementById('btn-search').onclick = function(e) {
    let searchTerm = document.getElementById('term-search').value;
    let searchResults;
    if (!searchTerm) {
      searchResults = _pages.getPublishedPagesId();
    } else {
      setCardsVisibility(_pages.getPublishedPagesId(), false);
      searchResults = _searchEngine.search(searchTerm, sortBy());
    }
    console.log(searchResults);
    setCardsVisibility(searchResults, true);
    document.getElementById('segment-count').textContent = searchResults.length;
  }

  document.getElementById('term-search').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById('btn-search').click();
    } else if (event.keyCode === 27) {
      event.preventDefault();
      document.getElementById('term-search').value = '';
      document.getElementById('btn-search').click();
    }
  });

  document.getElementById('btn-technical').onclick = searchFor('tag visualization or tag intelligence');
  document.getElementById('btn-fun').onclick = searchFor('tag art or tag game or tag interactive');
  document.getElementById('btn-pop-culture').onclick = searchFor('tag film');
}

function searchFor(termToSearch) {
  return function(e) {
    document.getElementById('term-search').value = 'mql: ' + termToSearch;
    document.getElementById('btn-search').click();
  };
}

function setupSort() {
  document.getElementById('choice-sort').onclick = function(e) {
    let val = Number(e.target.value);
    if (val) {console.log(val);
      sortOrder = val;
      loadCards();
      document.getElementById('btn-search').click();
    }
  }
}

function setCardsVisibility(cards, visible) {
  cards.forEach(
    pid => document.getElementById(pid).style.display = visible ? 'block' : 'none'
  );
}

function sortBy() {
  return _searchEngine.allSortBys()[sortOrder - 1];
}

document.addEventListener("DOMContentLoaded", initPage);