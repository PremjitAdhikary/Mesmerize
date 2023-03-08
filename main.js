let _pages;
let _searchEngine;
let sortOrder;

function pagesRefer(pages, searchEngine) {
  _pages = pages;
  _searchEngine = searchEngine;
}

function initPage() {
  loadVariables();
  loadCards();
  setupSearch();
  setupSort();
  document.getElementById('term-search').value = window.sessionStorage.getItem('mes-searchTerm');
  document.getElementById('btn-search').click();
}

function loadVariables() {
  let storedSort = window.sessionStorage.getItem('mes-sortOrder');
  sortOrder = storedSort ? storedSort : 1;
  let sortChoices = document.getElementById('choice-sort').children;
  for (let i = 0; i < sortChoices.length; i++) {
    if (sortChoices[i].value == sortOrder) {
      sortChoices[i].setAttribute('aria-checked', 'true');
    }
  }
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

function setSearchAndClick(searchTerm) {
  document.getElementById('term-search').value = searchTerm;
  window.sessionStorage.setItem('mes-searchTerm', searchTerm);
  document.getElementById('btn-search').click();
}

function setupSearch() {
  document.getElementById('btn-search').onclick = function(e) {
    let searchTerm = document.getElementById('term-search').value;
    window.sessionStorage.setItem('mes-searchTerm', searchTerm);
    let searchResults;
    hideAllCards();
    searchResults = _searchEngine.search(searchTerm, sortBy());
    setCardsVisibility(searchResults, true);
    document.getElementById('page-count').textContent = searchResults.length;
  }

  document.getElementById('term-search').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById('btn-search').click();
    } else if (event.keyCode === 27) {
      event.preventDefault();
      setSearchAndClick('');
    }
  });

  document.getElementById('btn-technical').onclick = searchFor('tag visualization or tag intelligence');
  document.getElementById('btn-fun').onclick = searchFor('tag art or tag game or tag interactive or tag festival');
  document.getElementById('btn-pop-culture').onclick = searchFor('tag film');
}

function searchFor(termToSearch) {
  return function(e) {
    setSearchAndClick('mql: ' + termToSearch);
  };
}

function setupSort() {
  document.getElementById('choice-sort').onclick = function(e) {
    let val = Number(e.target.value);
    if (val) {
      sortOrder = val;
      window.sessionStorage.setItem('mes-sortOrder', val);
      loadCards();
      document.getElementById('btn-search').click();
    }
  }
}

function hideAllCards() {
  _pages.getAllPagesId().forEach(
    pid => {
      if (document.getElementById(pid)) 
        document.getElementById(pid).style.display = 'none';
    }
  );
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