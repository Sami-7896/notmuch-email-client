'use strict';

var config = {};

config.page = 50; // number of entries per page
config.log = false; // number of entries per page

config.delay = 2; // seconds
config.interval = 5; //minutes
config.command = '';

// reserved: 'trash', 'spam', 'mark-as-read', 'mark-as-unread', 'archive'
config.commands = [];

config.archive = {
  action: ''
};
