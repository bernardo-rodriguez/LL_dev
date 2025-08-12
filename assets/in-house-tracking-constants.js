//Get a customized whitening solution for just {<sup>$</sup>19} today.
affiliate_config = {
    'default': {
        'general': {
            'announcement_bar': 'Start Whitening Today for just $29!',
        },
        'pricing': {
            'onetime': '59',
            'subscription': '29',
            'one_time_enabled': true,
            'subscription_enabled': true,
        },
        'flow': {
            'product_page': null,
            'skip_quiz': false,
            'discount_code': null,
            'cart_attribute': null,
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
        }
    },
    'nift': {
        'product_page': 'special',
        'flow': {
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN'
        },
        'general': {
            'announcement_bar': 'Welcome NIFT Users! Your discount is auto-applied!',
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
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN'
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
            'discount_code': 'NIFT_AUTOMATIC,NIFT_AUTO,ADD_PEN'
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
        }
    },
    'ls1_offer': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
        }
    },
    'cpgap_home': {
        'pricing': {
            'one_time_enabled': true,
            'subscription_enabled': true,
        }
    },
    'redirect_cpgap': {
        'flow': {
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
            'one_time_enabled': true,
            'subscription_enabled': true,
        },
        'general': {
            'announcement_bar': 'Sweatcoin discounts auto applied at checkout!',
        },
        'flow': {
            'product_page': '/products/at-home-whitening-kit-affiliate-ft',
            'discount_code': 'Pen-Addon',
            'cart_attribute': 'sweatcoin',
        },
        'landing_page_copy': {
            'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_price': '9',
            // 'hero_subtitle_1': ['margin-bottom', '50px !important'],
            'hero_title': 'Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">Today</span>',
            // 'hero_title': 'Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit',
            'Hero_Subtitle': "See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.",
            // 'hero_price': '0',
        },
        'featured_product': {
            'subPrice': '0',
            'subPrice': '9',
            'discount_name': 'SWEATCOIN_LIMITED',
            // 'discount_desc': '100% OFF',
            'discount_desc': '85% OFF',
            'regular_item_price': '$59'
        }
    },
    'redirect_ut': {
        'pricing': {
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'flow': {
            'product_page': '/products/at-home-whitening-kit-affiliate-ut',
            'discount_code': 'Pen-Addon',
            'cart_attribute': 'cactus_media',
            'show_upsell': false,
            'discount_code': 'ADD_PEN'
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
    // 'redirect_ut': {
    //     'pricing': {
    //         'one_time_enabled': false,
    //         'subscription_enabled': true
    //         // 'subscription': '4.95'
    //     },
    //     'general': {
    //         'announcement_bar': 'Discount auto applied at checkout!',
    //     },
    //     'flow': {
    //         'product_page': '/products/at-home-whitening-kit-affiliate-ut',
    //         'cart_attribute': 'cactus_media',
    //         'show_upsell': true,
    //         'discount_code': 'UTM_GEN_TRIAL,Pen-Addon'
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
            'one_time_enabled': false,
            'subscription_enabled': true,
        },
        'general': {
            'announcement_bar': 'Discount auto applied at checkout!',
        },
        'flow': {
            'product_page': '/products/at-home-whitening-kit-affiliate-ut',
            'discount_code': 'Pen-Addon',
            'cart_attribute': 'cactus_media',
            'show_upsell': false,
            'discount_code': 'ADD_PEN'
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
    // 'redirect_ut_trial': {
    //     'pricing': {
    //         'one_time_enabled': false,
    //         'subscription_enabled': true
    //         // 'subscription': '4.95'
    //     },
    //     'general': {
    //         'announcement_bar': 'Discount auto applied at checkout!',
    //     },
    //     'flow': {
    //         'product_page': '/products/at-home-whitening-kit-affiliate-ut',
    //         'cart_attribute': 'cactus_media',
    //         'show_upsell': true,
    //         'discount_code': 'UTM_GEN_TRIAL,Pen-Addon'
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
    'redirect_ut_direct': {
        'featured_product': {
            'subPrice': '9'
        }
    },
    'redirect_miles': {
        'flow': {
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
            'discount_code': 'SKIMM25',
            'cart_attribute': 'skimm',
        },
    },
    'redirect_pinterest': {
        'flow': {
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
        }
    }
}


one_time_price_copy = {
    'default': {
        'first': {
            'offer_title': 'Buy 1 - Save 22%',
            'retail_saving': 'Retail $76',
            'subtotal': '$59',
            'save': 'Save $17'
        },
        'second': {
            'offer_title': 'Buy 2, Get 1 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $228',
            'subtotal': '$118',
            'save': 'Save $128'
        },
        'third': {
            'offer_title': 'Buy 3, Get 2 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $380',
            'subtotal': '$177',
            'save': 'Save $230'
        }
    },
    'redirect_cpgap': {
        'first': {
            'offer_title': 'Buy 1 - Save 35%',
            'retail_saving': 'Retail $76',
            'subtotal': '$49',
            'save': 'Save $27'
        },
        'second': {
            'offer_title': 'Buy 2, Get 1 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $228',
            'subtotal': '$98',
            'save': 'Save $130'
        },
        'third': {
            'offer_title': 'Buy 3, Get 2 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $380',
            'subtotal': '$147',
            'save': 'Save $233'
        }
    },
    'jam_media': {
        'first': {
            'offer_title': 'Buy 1 - Save 35%',
            'retail_saving': 'Retail $76',
            'subtotal': '$49',
            'save': 'Save $27'
        },
        'second': {
            'offer_title': 'Buy 2, Get 1 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $228',
            'subtotal': '$98',
            'save': 'Save $130'
        },
        'third': {
            'offer_title': 'Buy 3, Get 2 FREE <br> + Free Shipping',
            'retail_saving': 'Retail $380',
            'subtotal': '$147',
            'save': 'Save $233'
        }
    }
}