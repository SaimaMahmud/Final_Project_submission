function Transaction(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
}

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate data on initial page load
  populate();
  
});

function populate() {
  populateUsers();
  populateTransactions();
  populateBlocks();
  populateBalance();
}

// Functions =============================================================

function populateUsers() {

  // Empty content string
  var text = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/all', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data.users, function(index, value){
      text += '<option value="' + value + '">' + value + '</option>'
    });

    // Inject the whole content string into our existing HTML select
    $('#fromUser').html(text);
    $('#toUser').html(text);
    $('#miner').html(text);
  });
};

function populateTransactions() {
    var text = ''

    // jQuery AJAX call for JSON
    $.getJSON( '/transactions/all', function( data ) {
      $.each(data, function(){
        text += '<tr>';
        text += '<td>' + this.fromAddress + '</td>'
        text += '<td>' + this.toAddress + '</td>'
        text += '<td>' + this.amount + '</td>'
        text += '</tr>'
      });
      $('#recentTransactions').html(text);
    });
}

function populateBlocks() {
    var text = ''

    // jQuery AJAX call for JSON
    $.getJSON( '/blocks/all', function( data ) {
      $.each(data, function(){
        text += '<tr>';
        text += '<td>' + this.previousHash + '</td>'
        text += '<td>' + this.hash + '</td>'
        text += '<td>' + this.transactions.length + '</td>'
        text += '</tr>'
      });
      $('#recentMines').html(text);
    });
}

function populateBalance() {
    var text = ''

    // jQuery AJAX call for JSON
    $.getJSON( '/balance', function( data ) {
      $.each(data, function(key, value){
        text += '<tr>';
        text += '<td>' + key + '</td>'
        text += '<td>' + value + '</td>'
        text += '</tr>'
      });
      $('#balance').html(text);
    });
}

function initBitcoin() {
	$.ajax({
      type: 'DELETE',
      url: '/transactions/reset/' + $('#difficulty').val()
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Populate data on reset
      populate();

    });
}

function createTransaction() {
    var from = $('#fromUser').val();
    var to = $('#toUser').val();
    var amount = parseFloat($('#amount').val());
    if (!from || !to || !amount) {
        alert("Please enter an amount.")
    } else if (amount < 0) {
        alert("Please enter an amount greater than 0.")
    } else if (from === to) {
        alert("User cannot transfer amount to himself.")
    } else {
		var transaction = new Transaction(from, to, amount);
		$.ajax({
		  type: 'POST',
		  data: transaction,
		  url: '/transactions/add',
		}).done(function( response ) {
			// Check for a successful (blank) response
			if (response.msg === '') {
			}
			else {
		       alert('Balance of ' + from + ' is 0.');
			}
			  
            populateTransactions()
            populateBalance()
		});
    }
}

function mine() {
	$('#pleaseWaitDialog').removeClass('hide').addClass('show')
    var miner = $('#miner').val();
	$.ajax({
	  type: 'POST',
	  data: miner,
	  url: '/mine',
      contentType: 'text/plain'
	}).done(function( response ) {
		// Check for a successful (blank) response
		if (response.msg === '') {
		}
		else {
		   alert('Error: ' + response.msg);
		}
		populateBlocks()
		populateTransactions()
		populateBalance()
		$('#pleaseWaitDialog').removeClass('show').addClass('hide')
	});
}
