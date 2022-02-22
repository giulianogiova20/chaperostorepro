$(document).ready(function(){
	//Filter
		$('.filter .item > .controls > .checkbox-group').on('click', '.checkbox', function(){
          $(this).parents('.checkbox-group').append('<h4 style="display:none" id="no-disponible" class="text-center">No disponible por el momento</h4>')
		  $('h4')
          .fadeIn(1500)
            .delay(700)
            .fadeOut(1500, function(){$(this).remove()})
		});


		$('.filter .item a[data-action="clear"]').on('click', function(){
			$(this).parents('.item').find('input').prop('checked', false)
			$(this).parents('.item').find('.checkbox-group').attr('data-status', 'inactive')
		});
		

		$('.filter .item a[data-action="open"]').on('click', function(){
			if( $(this).attr('class') == 'down' ){
				$(this).removeClass('down').addClass('up')
				$(this).parents('.item').find('.title > a[data-action="clear-price"]').fadeIn('slow') 
				$(this).parents('.item').find('.title > a[data-action="clear"]').fadeIn('slow') 
				$(this).parents('.item').find('.controls').fadeIn('slow') }
			else {
				$(this).removeClass('up').addClass('down')
				$(this).parents('.item').find('.title > a[data-action="clear-price"]').fadeOut('slow')
				$(this).parents('.item').find('.title > a[data-action="clear"]').fadeOut('slow')
				$(this).parents('.item').find('.controls').fadeOut('slow') }
		});
        //Filter

		//Slider price
			$('.filter a[data-action="clear-price"]').on('click', function(){

				$( ".filter #slider-price" ).slider({ values: [ 500, 400000 ] })

				$( ".filter #amount" ).html("$ " + $( ".filter #slider-price" ).slider( "values", 0 ) + "- $ " + $( ".filter #slider-price" ).slider( "values", 1 ))
			});

			if( $('.filter').find('#slider-price').length > 0 ){
				$( ".filter #slider-price" ).slider({
				  range: true,
				  min: 500,
				  max: 400000,
				  values: [ 500, 400000 ],
				  slide: function( event, ui ) {
				    $( "#amount" ).html( "$ " + ui.values[ 0 ] + " - $ " + ui.values[ 1 ] )
				  }
				})
			}

			if( $('.filter').find('#slider-price').length > 0 ){
				$( ".filter #amount" ).html("$ " + $( "#slider-price" ).slider( "values", 0 ) + "- $ " +$( "#slider-price" ).slider( "values", 1 ))
			}
		//Slider price
    })

		//Cart
		//Toggle
		setTimeout(function(){ $('body').find('.cart').fadeIn(200); }, 500);


		$('a[href="#open-cart"]').on('click', function(){
			$('body').attr('data-view', 'modal-open');
			$('body').find('.cart').attr('data-toggle', 'active');
		});
		

		$('.cart').on('click', '.label', function(){
			$('body').attr('data-view', 'modal-open');
			$(this).parents('.cart').attr('data-toggle', 'active');
			//$('body').find('.cart').fadeIn('slow');
		});
		
		$('.cart').on('click', 'button.close, .overlay', function(){
			$('body').attr('data-view', '');
			$(this).parents('.cart').attr('data-toggle', 'inactive');
			//$('body').find('.cart').fadeOut('slow');
		});
	//Toggle

/* 	//Scroll
		$(".cart .content").mCustomScrollbar({
			theme:"dark",
			scrollButtons: false,
			contentTouchScroll: true
		});
	//Scroll */
//Cart