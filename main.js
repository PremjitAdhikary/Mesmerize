let _pages;

function pagesRefer(pages) {
  _pages = pages;
}

function initPage() {
  loadCards();
  setupSearch();
}

function loadCards() {
  let holder = document.getElementById("cardholder");
  holder.innerHTML = "";
  _pages.getAllPagesId().forEach(function(pid) {
    let aCard = document.createElement('page-card');
    aCard.id = pid;
    holder.append(aCard);
  });
}

function setupSearch() {
  document.getElementById('btn-search').onclick = function(e) {
    let searchTerm = document.getElementById('term-search').value;
    if (!searchTerm) {
      setCardsVisibility(_pages.getAllPagesId(), true);
      return;
    }
    setCardsVisibility(_pages.getAllPagesId(), false);
    setCardsVisibility(_pages.getPageIdsByName(searchTerm), true);
    setCardsVisibility(_pages.getPageIdsByTag(searchTerm), true);
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

function setCardsVisibility(cards, visible) {
  cards.forEach(
    pid => document.getElementById(pid).style.display = visible ? 'block' : 'none'
  );
}

document.addEventListener("DOMContentLoaded", initPage);