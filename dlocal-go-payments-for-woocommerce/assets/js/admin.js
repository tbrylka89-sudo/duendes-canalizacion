( function( $ ) {
	'use strict';

	$( document ).ready( function() {
		// Tab switching
		$( '.dlocal-go-tab' ).on( 'click', function() {
			var tabId = $( this ).data( 'tab' );

			$( '.dlocal-go-tab' ).removeClass( 'active' );
			$( this ).addClass( 'active' );

			$( '.dlocal-go-tab-content' ).removeClass( 'active' );
			$( '#dlocal-go-tab-' + tabId ).addClass( 'active' );
		} );

		// Update environment badge
		function updateEnvironmentBadge() {
			var isProduction = $( '#woocommerce_dlocal_go_production' ).is( ':checked' );
			var badge = $( '.dlocal-go-environment-badge' );

			if ( isProduction ) {
				badge.removeClass( 'sandbox' ).addClass( 'production' ).text( 'Production' );
			} else {
				badge.removeClass( 'production' ).addClass( 'sandbox' ).text( 'Sandbox' );
			}
		}

		$( '#woocommerce_dlocal_go_production' ).on( 'change', updateEnvironmentBadge );
		updateEnvironmentBadge();
	} );
} )( jQuery );
