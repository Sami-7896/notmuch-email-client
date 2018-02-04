/* globals utils, config, view, args */
'use strict';

utils.storage.get(config).then(prefs => {
  const extra = document.getElementById('extra');
  if (prefs.commands.length) {
    const li = document.createElement('li');
    li.classList.add('separator');
    extra.appendChild(li);
  }
  prefs.commands.forEach(command => {
    const {action, name, classList = [], alert, warn} = prefs[command];
    const exists = document.querySelector(`[data-cmd="${command}"]`);
    const li = exists ? exists : document.createElement('li');

    Object.assign(li.dataset, {
      action: action,
      cmd: 'user-action',
      alert: alert || '',
      warn: warn || ''
    });
    if (exists) {
      li.dataset.ocmd = command;
    }
    else {
      li.textContent = name;
      classList.forEach(c => li.classList.add(c));
      extra.appendChild(li);
    }
  });
});

document.addEventListener('click', ({target}) => {
  const {cmd, alert, warn} = target.dataset;
  let action = target.dataset.action;

  const perform = () => utils.native.exec(action).then(r => {
    console.log(r);
    if (r.code !== 0 && alert === 'true' && window.top !== window) {
      window.top.api.user.alert({
        title: 'User Action Error',
        body: r.error.stderr
      });
    }
    view.emit('refresh');
    utils.notmuch.count(args.query);
  });

  if (cmd === 'user-action') {
    action = action
      .replace('[threads]', view.threads().map(id => 'thread:' + id).join(' '))
      .replace('[query]', args.query);

    if (action) {
      if (warn) {
        if (window.top === window) {
          console.log('this action is only available in the client mode');
        }
        else {
          window.top.api.user.confirm({
            title: 'Confirm',
            body: warn
          }).then(perform);
        }
      }
      else {
        perform();
      }
    }
    else {
      window.alert('"action" is empty! Use the options page to fix this.');
    }
  }
});