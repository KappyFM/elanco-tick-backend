const { loadData } = require('./data');

loadData().then(data => {
  console.log('Loaded records:', data.length);
  console.log(data[0]); // Show the first record
});
