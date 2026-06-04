console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);
console.log('has app in electron pkg:', typeof require('electron') === 'object');
process.exit(0);
