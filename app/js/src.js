var $ = require("jquery");

$('a').on('click', function(e){
  console.log(e, this);
});