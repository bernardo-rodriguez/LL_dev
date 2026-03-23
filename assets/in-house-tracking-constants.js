//Get a customized whitening solution for just {<sup>$</sup>19} today.
affiliate_config = {
    'default': {
        // 'general': {
        //     'announcement_bar': 'HOLIDAY SALE LIVE - 20% OFF ALL PRODUCTS',
        // },
        'general': {
            'product_banner': {
                'bold': 'LIMITED TIME OFFER:',
                'text': '{{bold}} 50% OFF YOUR FIRST SUBSCRIPTION PLUS FREE SHIPPING AND A GIFT',
            },
        },
        'pricing': {
            'onetime': '59',
            'subscription': '29',
            'one_time_enabled': true,
            'subscription_enabled': true,
            'bundle_enabled': true,
            'quantity_selector': true,
        },
        'flow': {
            'product_page': null,
            'skip_quiz': false,
            'discount_code': null,
            'cart_attribute': null,
            'add_pen_with_kit': false,  // when true, automatically add To-Go Whitening Pen when customer adds main kit (1-month) to cart; set false to disable per affiliate
        },
        'product_page_copy': {
            'bundle_offer_title': 'Buy Now',
        },
        'landing_page_copy': {
            'hero_subtitle_1': null,
            'hero_title': null,
            'Hero_Subtitle': null,
            'hero_price': '29',
            'pricing_table_us_data': '59',
        },
        'featured_product': {
            'subPrice': '29',
            'discount_name': 'SUB-N-SAVE',
            'discount_desc': '75% OFF',
            'regular_item_price': null
        }
    },
    'onetime': {
        'pricing': {
            'one_time_enabled': true,
            'subscription_enabled': false,
            'bundle_enabled': false,
        }
    },
    'nift': {
        'product_page': 'special',
        'flow': {
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN'
        },
        'general': {
            'announcement_bar': 'Welcome NIFT Users! Your discount is auto-applied!',
            // 'product_banner': { 'bold': 'LIMITED TIME OFFER:', 'text': '{{bold}} 30% OFF...' }, // optional; put {{bold}} in text where bold should appear; omit key to use default
        },
    },
    'nift_6': {
        'product_page': 'special',
        'general': {
            'announcement_bar': 'Welcome NIFT Users! Your discount is auto-applied!',
        },
        'flow': {
            'product_page': '/products/6-serving-of-whitening-gels-free-starter-kit',
            'cart_attribute': 'nift_6',
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN',
            'add_pen_with_kit': false, 
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            // 'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            'hero_price': '17',
            'pricing_table_us_data': '17',
            // 'hero_price': '0',
        },
        'featured_product': {
            // 'subPrice': '0',
            'subPrice': '17',
            'discount_name': 'NIFT_AUTOMATIC',
            'discount_desc': '72% OFF',
            'regular_item_price': '$59'
        }
    },
    'nift_bundle': {
        'product_page': 'special',
        'general': {
            'announcement_bar': 'Welcome NIFT Users! Your discount is auto-applied!',
        },
        'flow': {
            'product_page': '/products/starter-whitening-kit-6-treatments-free-pen',
            'cart_attribute': 'nift_bundle',
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN',
            'add_pen_with_kit': false, 
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            // 'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            'hero_price': '25',
            'pricing_table_us_data': '25',
            // 'hero_price': '0',
        },
        'featured_product': {
            // 'subPrice': '0',
            'subPrice': '25',
            'discount_name': 'NIFT_AUTO',
            'discount_desc': '74% OFF',
            'regular_item_price': '$95'
        }
    },
    'pe1_offer': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'landing_page_copy': {
            'hero_subtitle_1': null,
            'hero_title': null,
            'Hero_Subtitle': null,
            'hero_price': '59',
        },
        'featured_product': {
            'subPrice': '59',
            'discount_name': 'Starter Kit',
            'discount_desc': '22% OFF',
            'regular_item_price': null
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    },
    'lo1_offer': {
        'pricing': {
            'one_time_enabled': true,
            'subscription_enabled': false,
        },
        'landing_page_copy': {
            'hero_subtitle_1': null,
            'hero_title': null,
            'Hero_Subtitle': null,
            'hero_price': '59',
        },
        'featured_product': {
            'subPrice': '59',
            'discount_name': 'Starter Kit',
            'discount_desc': '22% OFF',
            'regular_item_price': null
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    },
    'ls1_offer': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    },
    'cpgap_home': {
        'pricing': {
            'one_time_enabled': true,
            'subscription_enabled': true,
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    },
    'redirect_cpgap': {
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'CPGAP_STARTER',
            'cart_attribute': 'redirect_cpgap',
            'bundle_discount': {'1':'CPGAP_STARTER', '2':'CPGAP_STARTER_2', '3': 'CPGAP_STARTER_3'}
        },
        'pricing': {
            'onetime': '49',
            'subscription': '19',
            'one_time_enabled': true,
            'subscription_enabled': false,
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '49',
        },
        'featured_product': {
            'subPrice': '49',
            'discount_name': 'CPGAP_STARTER',
            'discount_desc': '35% OFF',
            'regular_item_price': '$76'
        }
    },
    'redirect_cpgap_gen': {
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'CPGAP_SUB',
            'cart_attribute': 'redirect_cpgap_gen',
        },
        'pricing': {
            'onetime': '49',
            'subscription': '19',
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '19',
        },
        'featured_product': {
            'subPrice': '19',
            'discount_name': 'CPGAP_SUB',
            'discount_desc': '75% OFF',
            'regular_item_price': '$76'
        }
    },
    'jam_media': {
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'TJM_OFFER_1Q',
            'cart_attribute': 'jam_media',
            'bundle_discount': {'1':'TJM_OFFER_1Q', '2':'TJM_OFFER_2W', '3': 'TJM_OFFER_3E'}
        },
        'pricing': {
            'onetime': '49',
            'subscription': '19',
            'one_time_enabled': true,
            'subscription_enabled': false,
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '49',
        },
        'featured_product': {
            'subPrice': '49',
            'discount_name': 'TJM_OFFER_1Q',
            'discount_desc': '35% OFF',
            'regular_item_price': '$76'
        }
    },
    'jam_media_gen': {
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'TJM_OFFER_1Q',
            'cart_attribute': 'jam_media',
        },
        'pricing': {
            'onetime': '49',
            'subscription': '19',
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '19',
        },
        'featured_product': {
            'subPrice': '19',
            'discount_name': 'TJM_OFFER_1Q',
            'discount_desc': '75% OFF',
            'regular_item_price': '$76'
        }
    },
    'redirect_paceline': {
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'PACELINE_AUTOMATIC',
            'cart_attribute': 'paceline',
        },
        'landing_page_copy': {
            'hero_price': '29',
        },
        'featured_product': {
            'subPrice': '29'
        }
    },
    'redirect_sweatcoin': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
            'quantity_selector': true,
            'show_kit_selector_on_affiliate_product': true,
        },
        'general': {
            'announcement_bar': 'Sweatcoin discounts auto applied at checkout!',
            'product_banner': {
                'bold': 'SWEATCOIN SPECIAL:',
                'text': '{{bold}} 90% OFF YOUR FIRST SUBSCRIPTION PLUS FREE SHIPPING',
            },
        },
        'product_page_copy': {
            'bundle_offer_title': 'Sweatcoin Special',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'product_page': '/products/at-home-whitening-kit-affiliate-ft',
            'discount_code': 'pen-addon,UTM_SUB_12_TREATMENTS_S,UTM_SUB_12_TREATMENTS_STRONG_S',
            'cart_attribute': 'sweatcoin',
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '5.95',
            // 'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            // 'hero_price': '0',
        },
        'featured_product': {
            'subPrice': '0',
            'subPrice': '5.95',
            'discount_name': 'SWEATCOIN_LIMITED',
            // 'discount_desc': '100% OFF',
            'discount_desc': '85% OFF',
            'regular_item_price': '$59'
        }
    },
    // 'redirect_ut': {
    //     'pricing': {
    //         'subscription_enabled': true,
    //         'one_time_enabled': false,
    //         'bundle_enabled': false,
    //         'subscription_discount': '6',
    //     },
    //     'general': {
    //         'announcement_bar': 'Discount auto applied at checkout!',
    //     },
    //     'product_page_copy': {
    //         'bundle_offer_title': 'Starter Kit',
    //     },
    //     'flow': {
    //         'add_pen_with_kit': false, 
    //         'product_page': '/products/at-home-whitening-kit-affiliate-ut',
    //         'cart_attribute': 'cactus_media',
    //         'show_upsell': true,
    //         'discount_code': 'UTM_GEN_TRIAL, Pen-Addon,UTM_SUB_12_TREATMENTS,UTM_SUB_12_TREATMENTS_STRONG'
    //     },
    //     'landing_page_copy': {
    //         'hero_subtitle_1': ['margin-bottom', '50px !important'],
    //         'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>',
    //         // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
    //         'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
    //         // 'hero_price': '9',
    //         'hero_price': '0',
    //     },
    //     'featured_product': {
    //         'subPrice': '0',
    //         // 'subPrice': '9',
    //         'discount_name': 'FREE_TRIAL_SPECIAL',
    //         // 'discount_name': 'STARTER_SPECIAL',
    //         'discount_desc': '100% OFF',
    //         // 'discount_desc': '85% OFF',
    //         'regular_item_price': '$59'
    //     }
    // },
    'redirect_ut': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
            // 'subscription_discount': '4',
            // 'subscription': '4.95'
        },
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',

        },
        'flow': {
            'add_pen_with_kit': false, 
            'product_page': '/products/at-home-whitening-kit-affiliate-ut',
            'cart_attribute': 'cactus_media',
            // 'show_upsell': true,
            'discount_code': 'pen-addon,UTM_SUB_12_TREATMENTS,UTM_SUB_12_TREATMENTS_STRONG'
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            // 'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            // 'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            'hero_price': '8.99',
            // 'hero_price': '2.95',
        },
        'featured_product': {
            // 'subPrice': '2.95',
            'subPrice': '8.99',
            // 'discount_name': 'FREE_TRIAL_SPECIAL',
            'discount_name': 'STARTER_SPECIAL',
            'discount_desc': '85% OFF',
            'regular_item_price': '$59'
        }
    },
    // 'redirect_ut_trial': {
    //     'pricing': {
    //         'one_time_enabled': false,
    //         'subscription_enabled': true,
    //     },
    //     'general': {
    //         'announcement_bar': 'Discount auto applied at checkout!',
    //     },
    //     'flow': {
    //         'add_pen_with_kit': false, 
    //         'product_page': '/products/at-home-whitening-kit-affiliate-ut',
    //         'discount_code': 'Pen-Addon',
    //         'cart_attribute': 'cactus_media',
    //         'show_upsell': false,
    //         'discount_code': 'ADD_PEN'
    //     },
    //     'landing_page_copy': {
    //         'hero_subtitle_1': ['margin-bottom', '50px !important'],
    //         // 'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>',
    //         // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
    //         // 'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
    //         'hero_price': '9',
    //         // 'hero_price': '0',
    //     },
    //     'featured_product': {
    //         // 'subPrice': '0',
    //         'subPrice': '9',
    //         // 'discount_name': 'FREE_TRIAL_SPECIAL',
    //         'discount_name': 'STARTER_SPECIAL',
    //         'discount_desc': '85% OFF',
    //         'regular_item_price': '$59'
    //     }
    // },
    'redirect_ut_trial': {
        'pricing': {
            'subscription_enabled': true,
            'one_time_enabled': false,
            'bundle_enabled': false,
            'subscription_discount': '4',
        },
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'product_page_copy': {
            'bundle_offer_title': 'Starter Kit',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'product_page': '/products/at-home-whitening-kit-affiliate-ut',
            'cart_attribute': 'cactus_media',
            'show_upsell': true,
            'discount_code': 'UTM_GEN_TRIAL,Pen-Addon'
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            // 'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            // 'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            'hero_price': '9',
            // 'hero_price': '0',
        },
        'featured_product': {
            // 'subPrice': '0',
            'subPrice': '9',
            // 'discount_name': 'FREE_TRIAL_SPECIAL',
            'discount_name': 'STARTER_SPECIAL',
            'discount_desc': '85% OFF',
            'regular_item_price': '$59'
        }
    },
    'redirect_ut_direct': {
        'featured_product': {
            'subPrice': '9'
        }
    },
    'redirect_miles': {
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'MILES_AUTOMATIC',
            'cart_attribute': 'miles',
        },
        'landing_page_copy': {
            'hero_price': '9',
        },
        'featured_product': {
            'subPrice': '9',
            'discount_name': 'MILES_AUTOMATIC',
            'discount_desc': '88% OFF',
            'regular_item_price': '$59'
        }
    },
    'redirect_skimm': {
        'general': {
            'announcement_bar': '👋 Skimm reader, discount auto-applied at checkout!',
        },
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'SKIMM25',
            'cart_attribute': 'skimm',
        },
    },
    'redirect_pinterest': {
        'flow': {
            'add_pen_with_kit': false, 
            'discount_code': 'PINTEREST25',
            'cart_attribute': 'pinterest',
        }
    },
    'redirect_studentbeans': {
        'landing_page_copy': {
            'hero_price': '9',
        },
        'featured_product': {
            'subPrice': '9'
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    },
    'redirect_inspire': {
        'general': {
            'announcement_bar': 'InspireMore readers, Discount is Automatically Applied at Checkout!',
        },
        'featured_product': {
            'subPrice': '13.5',
            'discount_name': 'Subscribe & Save',
            'discount_desc': '80% OFF',
            'regular_item_price': '$59'
        },
        'flow': {
            'add_pen_with_kit': false, 
        }
    }
}

base_one_time_price_copy = {
    'first': {
        'bundle_offer_title': 'Buy 1 - Save 25%',
        'bundle_current_price': '$59',
        'bundle_previous_price': '$76',
        'bundle_percent_off': '22% OFF',
        'bundle_price_per_treatment': '$9.83/Treatment'
    },
    'second': {
        'bundle_offer_title': 'Buy 2, Get 1 FREE',
        'bundle_current_price': '$118',
        'bundle_previous_price': '$228',
        'bundle_percent_off': '33% OFF',
        'bundle_price_per_treatment': '$6.55/Treatment'
    },
    'third': {
        'bundle_offer_title': 'Buy 3, Get 2 FREE',
        'bundle_current_price': '$177',
        'bundle_previous_price': '$295',
        'bundle_percent_off': '40% OFF',
        'bundle_price_per_treatment': '$5.9/Treatment'
    }
}

base_upsell_one_time_price_copy = {
    'first': {
        'bundle_offer_title': 'Buy 1 - Save 25%',
        'bundle_current_price': '$89',
        'bundle_previous_price': '$118',
        'bundle_percent_off': '25% OFF',
        'bundle_price_per_treatment': '$7.42/Treatment'
    },
    'second': {
        'bundle_offer_title': 'Buy 2, Get 1 FREE',
        'bundle_current_price': '$178',
        'bundle_previous_price': '$267',
        'bundle_percent_off': '33% OFF',
        'bundle_price_per_treatment': '$4.94/Treatment'
    },
    'third': {
        'bundle_offer_title': 'Buy 3, Get 2 FREE',
        'bundle_current_price': '$267',
        'bundle_previous_price': '$445',
        'bundle_percent_off': '40% OFF',
        'bundle_price_per_treatment': '$4.45/Treatment'
    }
}

affiliate_one_time_price_copy = {
    'default': {
        'first': base_one_time_price_copy['first'],
        'second': base_one_time_price_copy['second'],
        'third': base_one_time_price_copy['third']
    },
    'redirect_cpgap': {
        'first': base_one_time_price_copy['first'],
        'second': base_one_time_price_copy['second'],
        'third': base_one_time_price_copy['third']
    },
    'jam_media': {
        'first': base_one_time_price_copy['first'],
        'second': base_one_time_price_copy['second'],
        'third': base_one_time_price_copy['third']
    }
}

affiliate_upsell_one_time_price_copy = {
    'default': {
        'first': base_upsell_one_time_price_copy['first'],
        'second': base_upsell_one_time_price_copy['second'],
        'third': base_upsell_one_time_price_copy['third']
    }
}


base_subscription_price_copy = {
    'subscription_product_title': 'Whitening Kit (6 Treatments)',
    'next_price': '0',
    'price_per_treatment': '$4.83/Treatment',
    'previous_price': '$59'
}

base_upsell_subscription_price_copy = {
    'subscription_product_title': 'Whitening Kit (12 Treatments)',
    'next_price': '16',
    'price_per_treatment': '$3.75/Treatment',
    'previous_price': '$89'
}

affiliate_subscription_price_copy = {
    'default': base_subscription_price_copy,
    'redirect_ut': {
        'subscription_product_title': 'Whitening Kit (6 Treatments)',
        'next_price': '0',
        'price_per_treatment': '$2.98/Treatment',
        'previous_price': '$59'
    },
    'redirect_sweatcoin': {
        'subscription_product_title': 'Whitening Kit (6 Treatments)',
        'next_price': '0',
        'price_per_treatment': '$2.98/Treatment',
        'previous_price': '$59'
    }
}

affiliate_upsell_subscription_price_copy = {
    'default': base_upsell_subscription_price_copy,
    'redirect_ut': {
        'subscription_product_title': 'Whitening Kit (12 Treatments)',
        'next_price': '6.5',
        'price_per_treatment': '$1.32/Treatment',
        'previous_price': '$89'
    },
    'redirect_sweatcoin': {
        'subscription_product_title': 'Whitening Kit (12 Treatments)',
        'next_price': '10',
        'price_per_treatment': '$1.32/Treatment',
        'previous_price': '$89'
    }
}

/**
 * Reusable include items -- define once, reference in any config block.
 * type: 'item' = product/shipping row | 'disclaimer' = styled text box with link
 * dynamic_price: true = price calculated from variant/selling plan in renderer
 * is_shipping: true = renders with no image/border (shipping-style row)
 */
const INCLUDE_KIT_STARTER = {
    type: 'item',
    title: 'CUSTOM WHITENING KIT',
    image: 'https://cdn.shopify.com/s/files/1/0066/4728/3782/files/og_small_26338a09-fa97-40d9-a133-2eb7374c16ea.png?v=1771274817',
    bullets: ['6 TREATMENTS (2-MONTH SUPPLY)', '30-DAY SATISFACTION GUARANTEE'],
    dynamic_price: true,
};

const INCLUDE_KIT_DELUXE = {
    type: 'item',
    title: 'CUSTOM WHITENING KIT',
    image: 'https://cdn.shopify.com/s/files/1/0066/4728/3782/files/og_small_26338a09-fa97-40d9-a133-2eb7374c16ea.png?v=1771274817',
    bullets: ['12 TREATMENTS (4-MONTH SUPPLY)', '30-DAY SATISFACTION GUARANTEE'],
    dynamic_price: true,
};

const INCLUDE_PEN = {
    type: 'item',
    title: 'TO-GO WHITENING PEN',
    image: 'https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Generated_with_Kive.ai_-_Create_a_product_shot_of_this_with_a_white_background_behind_it._It_should_just_have_the_product_and_the_packaging.png?v=1771286740',
    bullets: ['SAME CUSTOM FORMULA'],
    previous_price: '$30',
    current_price: 'FREE',
};

const INCLUDE_SHIPPING = {
    type: 'item',
    title: 'SHIPPING',
    is_shipping: true,
    bullets: [],
    previous_price: '$5',
    current_price: 'FREE',
};

// Matches default affiliate_config.general.product_banner: "LIMITED TIME OFFER: 50% OFF YOUR FIRST SUBSCRIPTION PLUS FREE SHIPPING AND A GIFT"
const INCLUDE_SUBSCRIBE_DISCLAIMER = {
    type: 'disclaimer',
    text: '<strong>LIMITED TIME OFFER:</strong> 50% OFF YOUR FIRST SUBSCRIPTION PLUS FREE SHIPPING AND A GIFT.',
    link_text: 'Switch to <strong>Subscribe &amp; Save</strong>',
};

/** Refill PDP: same “first order includes” pattern as kits (no pen row). */
const INCLUDE_REFILL_GELS = {
    type: 'item',
    title: 'CUSTOM FORMULA REFILL GELS',
    image: 'https://cdn.shopify.com/s/files/1/0066/4728/3782/files/og_small_26338a09-fa97-40d9-a133-2eb7374c16ea.png?v=1771274817',
    bullets: ['6 REFILL TREATMENTS (2-MONTH SUPPLY)', '30-DAY SATISFACTION GUARANTEE'],
    dynamic_price: true,
};

/** PDP display price for refill one-time (may differ from variant cents for merchandising). */
refill_one_time_display_price = '30';

/**
 * Refill Subscribe & Save strike/compare — standalone one-time refill price (same as refill_one_time_display_price).
 * '' = hide strike. Defaults to refill_one_time_display_price in Skio if unset.
 */
refill_subscription_compare_price = '30';

/**
 * Refill one-time line strike in ORDER INCLUDES. '' = no strikethrough (only refill_one_time_display_price).
 * Set to '59' (or '$59') if you want a compare-at next to the one-time price.
 */
refill_one_time_compare_price = '';

/**
 * Refill product only — keyed by purchase type (not starter/deluxe).
 * Shown below Subscribe / One-time tabs like kit PDPs.
 * Subscription footer copy is built in Skio from the selected selling plan name (frequency).
 */
refill_first_order_includes = {
    subscription: {
        section_title: 'FIRST ORDER INCLUDES',
        items: [INCLUDE_REFILL_GELS, INCLUDE_SHIPPING],
        show_total: true,
        footer_text: '',
    },
    one_time: {
        section_title: 'ORDER INCLUDES',
        items: [INCLUDE_REFILL_GELS],
        show_total: false,
        footer_text: '',
    },
};

/**
 * First Order Includes config.
 * Keyed by: kit (starter/deluxe) x purchase type (subscription/one_time).
 * Each block has: section_title, items[], show_total, footer_text.
 */
base_first_order_includes = {
    starter: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_STARTER, INCLUDE_PEN, INCLUDE_SHIPPING],
            show_total: true,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 60 DAYS',
        },
        one_time: {
            section_title: 'ORDER INCLUDES',
            items: [INCLUDE_KIT_STARTER, INCLUDE_SUBSCRIBE_DISCLAIMER],
            show_total: false,
            footer_text: '',
        },
    },
    deluxe: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_DELUXE, INCLUDE_PEN, INCLUDE_SHIPPING],
            show_total: true,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 90 DAYS',
        },
        one_time: {
            section_title: 'ORDER INCLUDES',
            items: [INCLUDE_KIT_DELUXE, INCLUDE_SUBSCRIBE_DISCLAIMER],
            show_total: false,
            footer_text: '',
        },
    },
}

cactus_order_includes = {
    starter: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_STARTER, INCLUDE_SHIPPING],
            show_total: false,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 60 DAYS',
        }
    },
    deluxe: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_DELUXE, INCLUDE_SHIPPING],
            show_total: false,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 90 DAYS',
        }
    },
}

sweatcoin_order_includes = {
    starter: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_STARTER, INCLUDE_SHIPPING],
            show_total: false,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 60 DAYS',
        }
    },
    deluxe: {
        subscription: {
            section_title: 'FIRST ORDER INCLUDES',
            items: [INCLUDE_KIT_DELUXE, INCLUDE_SHIPPING],
            show_total: false,
            footer_text: 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 90 DAYS',
        }
    },
}

affiliate_first_order_includes = {
    'default': base_first_order_includes,
    'redirect_ut': cactus_order_includes,
    'redirect_sweatcoin': sweatcoin_order_includes,
    'sweatcoin': sweatcoin_order_includes,
}

/**
 * First-ingredient (active whitener) copy in "Your Formula" section, keyed by strength cookie.
 * Used to update percentage and name when formula/strength changes.
 */
formula_ingredient_by_strength = {
    strong: { percentage: '11%', name: 'Hydrogen Peroxide' },
    medium: { percentage: '8%', name: 'Hydrogen Peroxide' },
    sensitive: { percentage: '25%', name: 'Sodium Bicarbonate' },
    gentle: { percentage: '25%', name: 'Sodium Bicarbonate' }
}

/**
 * Intro line in "Your Formula" section ("Given your X, diet and current teeth shade, we prescribed:").
 * Keyed by strength cookie.
 */
formula_intro_by_strength = {
    strong: 'Given your low-sensitivity, diet and current teeth shade, we prescribed:',
    medium: 'Given your medium-sensitivity, diet and current teeth shade, we prescribed:',
    sensitive: 'Given your sensitive teeth, diet and current teeth shade, we prescribed:',
    gentle: 'Given your sensitive teeth, diet and current teeth shade, we prescribed:',
}

/**
 * Refill PDP only — copy implies formula was already chosen (Formula Picker / cookie).
 * Keys: sensitive, medium, strong (matches `strength` cookie from refill picker).
 */
formula_intro_refill_by_strength = {
    sensitive: 'Based on your sensitive teeth, our optimized formula contains:',
    medium: 'Based on your medium-sensitivity, our optimized formula contains:',
    strong: 'Based on your low-sensitivity, our optimized formula contains:',
}