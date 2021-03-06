/* globals utils */
'use strict';

// apply user-styles
{
  const textContent = localStorage.getItem('search-css');
  if (textContent) {
    document.documentElement.appendChild(Object.assign(document.createElement('style'), {
      textContent
    }));
  }
}

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  const query = document.getElementById('search').value;

  if (query && window.top !== window) {
    const {api} = window.top;

    api.tree.select(false);
    api.list.show({query});

    utils.notmuch.count(query);

    api.client.title('Search results for "' + query + '"');
  }
});
