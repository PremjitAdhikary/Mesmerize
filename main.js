let _pages;
let sortOrder = 1;

function pagesRefer(pages) {
  _pages = pages;
}

function initPage() {
  loadCards();
  setupSearch();
  setupSort();
}

function loadCards() {
  let holder = document.getElementById("cardholder");
  holder.innerHTML = "";
  let pageIds;
  switch(sortOrder) {
    case 1:
      pageIds = _pages.getPublishedPagesId().slice().reverse();
      break;
    case 2:
      pageIds = _pages.getPublishedPagesId().slice();
      break;
    case 3:
      pageIds = [
        ..._pages.getPageIdsByRank(1).reverse(), 
        ..._pages.getPageIdsByRank(2).reverse(),
        ..._pages.getPageIdsByRank(3).reverse(), 
        ..._pages.getPageIdsByRank(4).reverse()
      ]
      break;
  }
  pageIds.forEach(function(pid) {
    let aCard = document.createElement('page-card');
    aCard.id = pid;
    holder.append(aCard);
  });
}

function setupSearch() {
  document.getElementById('btn-search').onclick = function(e) {
    let searchTerm = document.getElementById('term-search').value;
    if (!searchTerm) {
      setCardsVisibility(_pages.getPublishedPagesId(), true);
      return;
    }
    setCardsVisibility(_pages.getPublishedPagesId(), false);
    if (searchTerm === 'latest') {
      setCardsVisibility(_pages.getLatestPages(), true);
    } else {
      setCardsVisibility(_pages.getPageIdsByName(searchTerm), true);
      setCardsVisibility(_pages.getPageIdsByTag(searchTerm), true);
    }
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
}

function setupSort() {
  document.getElementById('choice-sort').onclick = function(e) {
    let val = Number(e.target.value);
    if (val) {
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

document.addEventListener("DOMContentLoaded", initPage);