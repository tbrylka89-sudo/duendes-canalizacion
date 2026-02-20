( function() {
    'use strict';

    var registerPaymentMethod = window.wc.wcBlocksRegistry.registerPaymentMethod;
    var el = window.wp.element.createElement;
    var settings = window.wc.wcSettings.getSetting( 'dlocal_go_data', {} );

    if ( ! settings.title && window.dlocal_go_data ) {
        settings = window.dlocal_go_data;
    }

    var title = settings.title || 'dLocal Go';
    var description = settings.description || 'Pay using dLocal Go Checkout.';
    var iconUrl = settings.icon || 'https://dashboard.dlocalgo.com/favicon.svg';

    var Content = function() {
        return el( 'div', { className: 'dlocal-go-description' }, description );
    };

    var Label = function( props ) {
        return el(
            'span',
            { className: 'dlocal-go-payment-label', style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            el( 'img', { src: iconUrl, alt: 'dLocal Go', className: 'dlocal-go-icon' } ),
            el( props.components.PaymentMethodLabel, { text: title } )
        );
    };

    registerPaymentMethod( {
        name: 'dlocal_go',
        label: el( Label, null ),
        ariaLabel: title,
        content: el( Content, null ),
        edit: el( Content, null ),
        canMakePayment: function() { return true; },
        supports: { features: settings.supports || [ 'products' ] }
    } );
} )();
