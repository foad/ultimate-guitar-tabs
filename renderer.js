const fs = require('fs');
const shell = require('electron').shell;

const tabsFile = `${process.cwd()}/tabs.json`;
let tabs = [];

const initialiseApp = () => {
  tabs = JSON.parse(fs.readFileSync(tabsFile));
  renderTable(tabs);
  generateRandomTab();
};

const renderTable = (_tabs) => {
  const tabsEl = document.getElementById('tabs');
  const tableEl = document.createElement('table');
  tableEl.className = 'mdl-data-table mdl-js-data-table';
  const tableBodyEl = document.createElement('tbody');
  tableEl.appendChild(tableBodyEl);

  _tabs.forEach((tab, index) => {
    createTableRow(tableBodyEl, tab, index);
  });

  tabsEl.innerHTML = '';
  tabsEl.appendChild(tableEl);
}

const createTableRow = (table, tab, index) => {
  const tr = table.insertRow(-1);

  createDeleteCell(tr, index);

  tr.insertCell(-1).innerHTML = tab.artist;
  tr.insertCell(-1).innerHTML = tab.title;

  const link = document.createElement('button');
  link.className = 'mdl-button mdl-js-button mdl-button--icon mdl-button--accent';
  link.addEventListener('click', () => {
    shell.openExternal(tab.link);
  });
  link.innerHTML = '<i class="material-icons">link</i>';
  tr.insertCell(-1).appendChild(link);

  createGenreCell(tr, tab, index);

  tr.querySelectorAll('td').forEach(td => td.className = 'mdl-data-table__cell--non-numeric');
};

const createGenreCell = (tr, tab, index) => {
  if (!tab.genre) {
    tabs[index].genre = [];
    writeTabs();
  }
  const inputContainer = document.createElement('div');
  inputContainer.className = 'mdl-textfield mdl-js-textfield';

  const inputLabel = document.createElement('label');
  inputLabel.className = 'mdl-textfield__label';
  inputLabel.for = 'genre_' + index;
  inputLabel.innerHTML = 'Pop, Jazz, ...'

  const input = document.createElement('input');
  input.className = 'mdl-textfield__input';
  input.id = 'genre_' + index;
  if (tab.genre.length !== 0) input.value = tab.genre.join(', ');
  input.addEventListener('keyup', editGenre(index));

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(input);

  tr.insertCell(-1).appendChild(inputContainer);
};

const createDeleteCell = (tr, index) => {
  const del = document.createElement('button');
  del.innerHTML = '<i class="material-icons">delete</i>';
  del.id = 'delete_' + index;
  del.className = 'mdl-button mdl-js-button mdl-button--icon mdl-button--colored';
  del.addEventListener('click', deleteTab(index));
  tr.insertCell(-1).appendChild(del);
};

const editGenre = index => event => {
  const rawGenres = document.getElementById('genre_' + index).value;
  tabs[index].genre = convertGenres(rawGenres);

  writeTabs();
}

const convertGenres = (genres) => genres.split(',').map(genre => genre.trim()).filter(genre => genre.length);

const deleteTab = index => () => {
  tabs.splice(index, 1);
  writeTabs();
  renderTable(tabs);
};

const writeTabs = () => {
  fs.writeFileSync(tabsFile, JSON.stringify(tabs));
};

const titleCase = str => {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' ');
};

const getDetails = link => {
  const slugs = link.replace('https://', '').replace('tabs.ultimate-guitar.com/tab/', '').split('/');
  const artist = titleCase(slugs[0].replace('-', ' '));
  const title = titleCase(slugs[1].split('-').slice(0, -1).join(' '));

  return [artist, title];
};

generateRandomTab = () => {
  const resultEl = document.getElementById('random_tab_result');
  const tableEl = document.createElement('table');
  tableEl.className = 'mdl-data-table mdl-js-data-table';
  const tableBodyEl = document.createElement('tbody');
  tableEl.appendChild(tableBodyEl);

  const randomTab = tabs[Math.floor(Math.random() * tabs.length)];
  createTableRow(tableBodyEl, randomTab, 0);

  const del = tableEl.querySelector('[id^=delete_]');
  del.parentNode.removeChild(del);

  resultEl.innerHTML = '';
  resultEl.appendChild(tableEl);
};

document.addEventListener('DOMContentLoaded', () => {
  initialiseApp();
  document.querySelectorAll('input[data-required=true]').forEach(el => el.required = true);
});

document.getElementById('add_form').addEventListener('submit', event => {
  event.preventDefault();

  document.getElementById('add_form').reset();

  return false;
});

document.getElementById('search_input').addEventListener('keyup', event => {
  const search = document.getElementById('search_input').value;

  if (search.length === 0) {
    renderTable(tabs);
    return;
  }

  const terms = search.split(',').map(term => term.toLowerCase().trim()).filter(t => t.length);

  if (!terms || terms.length === 0) return;

  const _tabs = tabs.filter(tab => {
    let matches = [];

    terms.forEach(term => {
      matches.push(false);
      if (tab.artist.toLowerCase().includes(term)) matches[matches.length - 1] = true;
      if (tab.title.toLowerCase().includes(term)) matches[matches.length - 1] = true;
      if (tab.genre.some(genre => genre.toLowerCase().includes(term))) matches[matches.length - 1] = true;
    });

    return matches.every(match => match);
  });

  renderTable(_tabs);
});

document.getElementById('random_tab').addEventListener('click', generateRandomTab);

document.getElementById('add_submit').addEventListener('click', () => {
  const link = document.getElementById('add_link').value;
  const [ artist, title ] = getDetails(link);
  const genre = convertGenres(document.getElementById('add_genre').value);

  const newTab = {
    artist, title, link, genre,
  };

  tabs.unshift(newTab);
  writeTabs();
  renderTable(tabs);

  return false;
});