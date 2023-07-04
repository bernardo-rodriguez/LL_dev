customElements.define('formula-quiz-2', class FormulaQuiz2 extends HTMLElement {
  static get observedAttributes() {
    return ["data-state"];
  }
  constructor() {
    super();  
    this.open = document.querySelectorAll("[data-open-quiz-2]")
    this.close = this.querySelector(".quiz_2__close")
    this.headlines = this.querySelectorAll(".quiz_2__headline")
    this.quizCards = this.querySelectorAll(".form__step-wrapper_2")

    this.currentStep = this.dataset.state
    this.allInputs = this.querySelectorAll(`.form__step-wrapper_2 input`)

    // this.inputs = this.querySelectorAll(`.form__step-wrapper_2[data-step='${this.currentStep}'] input`)
    // this.inputNames = []
    // Array.from(this.inputs).forEach((i) => {if (!this.inputNames.includes(i.name)) this.inputNames.push(i.name)})
    // console.log(this.inputNames)
    this.feedback_dictionary = {
      // if blank conditions, always apply the same
      3: {
        "conditions": {
          "gum_2": {
            "plaque_2": {
              "text": "Our Formulas Come With “XXX” Which Removes Harmful Bacteria From The Mouth And Protects Your Gums.",
              "id": "three_response_text_1"
            }
          }
        }
      },
      6: {
        "conditions": {
          "shade_2": {}
        }
      },
      10: {
        "conditions": {
          "routine_2": {
            "strips_2": [
              {
                "text": "While Whitening Toothpaste removes surface stains, it doesn’t penetrate the teeth and change the color inside.",
                "id": "ten_response_text_1"
              },
              {
                "text": "The dentin inside the enamel is the yellow part of the teeth that gives it the yellow hue. That’s where we come in.",
                "id": "ten_response_text_2"
              }
          ]
          }
        }
      }
    }

    this.state_action = {
      '11': 'this.move()'
    }

    this.setInputs(this.currentStep)
    this.back = this.querySelector("[data-form-back]")
    this.back_2 = this.querySelector("[data-form-back-2]")
    this.next = this.querySelector("[data-form-next]")
    this.submit = this.querySelector("[data-form-submit]")
    this.begin = this.querySelector("[data-form-begin]")

    this.progress = 0

    this.form = this.querySelector(".quiz_2__form")

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.closeQuiz.bind(this))

    this.allInputs.forEach((input) => {
      input.addEventListener('input', function(e){
        if(this.validateFormStep(this.inputs) == true) {
          this.next.removeAttribute('disabled')
        } else {
          this.next.setAttribute('disabled', 'true')
        }
      }.bind(this))
    })

    this.bindEvents();
  }
  
  bindEvents() {
    this.open.forEach((button) => {
      button.addEventListener("click", function(e){
        e.preventDefault();
        if(document.querySelector("body").classList.contains("Menu_Open")) {
          document.querySelector("menu-drawer").closeMenuDrawer()
        }
        document.querySelector('.sticky-footer__button')?.click()
      } )
    })
    this.back.addEventListener('click', this.changeFormStep.bind(this, -1))
    this.back_2.addEventListener('click', this.changeFormStep.bind(this, -1))
    this.next.addEventListener('click', this.changeFormStep.bind(this, 1))
    this.close.addEventListener('click', this.closeQuiz.bind(this))
    this.begin.addEventListener('click', this.changeFormStep.bind(this, 1))
    this.submit.addEventListener('click', function(e){
      this.submitForm(e)
    }.bind(this))
  }

  fillProgressBar(newValue, total) {
    let progress = newValue / total
    let bar_point_1 = this.querySelector(`#bar_point_1`)
    let bar_point_2 = this.querySelector(`#bar_point_2`)
    let bar_point_3 = this.querySelector(`#bar_point_3`)
    let bar_point_4 = this.querySelector(`#bar_point_4`)
  
    bar_point_1.classList.remove('bar-point-filled')
    bar_point_2.classList.remove('bar-point-filled')
    bar_point_3.classList.remove('bar-point-filled')
    bar_point_4.classList.remove('bar-point-filled')

    if (progress >= .25) {
      bar_point_1.classList.add('bar-point-filled')
    } if (progress >=.5) {
      bar_point_2.classList.add('bar-point-filled')
    } if (progress >=.75) {
      bar_point_3.classList.add('bar-point-filled')
    } if (progress >= 1) {
      bar_point_4.classList.add('bar-point-filled')
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue && oldValue != null ) {
      this.querySelector(`.form__step-wrapper_2[data-step="${ oldValue }"`).classList.remove('active')
      this.querySelector(`.form__step-wrapper_2[data-step="${ newValue }"`).classList.add('active')
      this.fillProgressBar(newValue, 12)

      if( newValue == 12 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.remove('hidden')
      }
      if ( (newValue == 10 || newValue == 10.5) && oldValue == 12 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.add('hidden')
      }
      if (newValue in this.state_action) {
        eval(this.state_action[newValue])
      }
      this.progress = (newValue/12) * 100
      $('#progress_bar_filled_percent').css('width',  this.progress.toString() + '%')
    }
  }

  closeQuiz() {
    this.querySelector('.quiz_2').style.transitionDelay = '.2s'
    this.querySelector('.quiz_2').setAttribute('aria-hidden', 'true')
    document.querySelector('.page-transition__content').style.transform = 'translate(-50%, 50%)'
    setTimeout(() => {
      document.querySelector('.page-transition').classList.toggle('visible');
      document.querySelector('.sticky-footer__button').classList.toggle('hide')
      document.querySelector('.page-transition__content').style.removeProperty('transform')
      this.querySelector('.quiz_2').style.removeProperty('transition-delay')
    }, 900)
  }

  normalAdd(x, currentState) {
    let newState = 0
    if ( x === 1  && currentState < 12 ){
      if (currentState % 1 == 0) {
        newState = currentState + 1
      } else {
        newState = currentState + 0.5
      }
    } else if ( x === -1 && currentState > 0) {
      if (currentState % 1 == 0) {
        newState = currentState - 1
      } else {
        newState = currentState - 0.5
      }
    }
    return newState
  }

  stepSpecificText(to_change) {
    to_change.forEach((i) => {
      let id = i['id']
      let text = i['text']
      $(`#${id}`).html(text)
    })
  }

  getInputValue(input_name) {
    let input_value = []
    let selected_elements = $(`input[name=${input_name}]:checked`)

    if (selected_elements.length > 1) {
      selected_elements.each(function( index ) {
        input_value.push(selected_elements[index].value)
      })
    } else {
      input_value = [$(`input[name=${input_name}]:checked`).val()]
    }
    return input_value
  }

  changeFormStep(x) {
    let currentState = Number(this.dataset.state)
    if (currentState == 12) {
      currentState -= 1
    }
    let newState = currentState
    let available_states = {}
    let highest_priority = 10 // initiate highest priority text (for checkboxes)
    if (x == 1) {
      if (currentState in this.feedback_dictionary) {
        let feedbackState = this.feedback_dictionary[currentState]
        let input_name = Object.keys(feedbackState['conditions'])[0]
        let input_value = this.getInputValue(input_name)

        if (Object.keys(feedbackState['conditions'][input_name]).length == 0) {
          newState = currentState + 0.5
        } 
        // else if (input_value in feedbackState['conditions'][input_name]) {
        //   newState = currentState + 0.5
        //   this.stepSpecificText(feedbackState['conditions'][input_name][input_value])
        // } 
        else {
          for (value of input_value) {
            if (value in feedbackState['conditions'][input_name]) {
              available_states.push(feedbackState['conditions'][input_name][input_value])
            }
          }
          if (available_states.length > 0) {
            console.log(available_states)
            // newState = currentState + 0.5
            // this.stepSpecificText(feedbackState['conditions'][input_name][input_value])
          } else {
            newState = this.normalAdd(x, currentState)
          }
          // newState = this.normalAdd(x, currentState)
        }
      } else {
        newState = this.normalAdd(x, currentState)
      }
    } else {
      if (currentState - 1 in this.feedback_dictionary) {
        let feedbackState = this.feedback_dictionary[currentState - 1]
        let input_name = Object.keys(feedbackState['conditions'])[0]
        let input_value = this.getInputValue(input_name)

        if (feedbackState['conditions'][input_name].length == 0) {
          newState = currentState - 0.5
        } else if (input_value in feedbackState['conditions'][input_name]) {
          newState = currentState - 0.5
        } else {
          newState = this.normalAdd(x, currentState)
        }
      } else {
        newState = this.normalAdd(x, currentState)
      }
    }

    this.setAttribute('data-state', newState.toString() )

    this.setInputs(newState.toString())
    if(this.validateFormStep(this.inputs) == true) {
      this.next.removeAttribute('disabled')
    } else {
      this.next.setAttribute('disabled', 'true')
    }
  }

  move() {
    console.log("no?")
    let serialized = $('#contact_form').serialize()
    populateProfile(serialized)
    $('.quiz_2__content-buttons').hide()
    let i = 0
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 1;
      var id = setInterval(frame, 20);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
        }
      }
    }
    var that = this
    setTimeout(
      function() {
        $('.quiz_2__content-buttons').show()
        that.changeFormStep(1)
      }, 3000);
  }

  setInputs(step) {
    this.inputs = this.querySelectorAll(`.form__step-wrapper_2[data-step='${step}'] input`)
    this.inputNames = []
    Array.from(this.inputs).forEach((i) => {if (!this.inputNames.includes(i.name)) this.inputNames.push(i.name)})
  }

  validateFormStep(inputs) {
    let validationCheck = true
    for( const value of this.inputNames.values()){
      const i = this.querySelector(`[name='${value}']`)
      if( i.getAttribute('type') == 'checkbox' || i.getAttribute('type') == 'radio' ) {

        if(this.querySelector(`[name='${value}']:checked`)?.value == "" || this.querySelector(`[name='${value}']:checked`)?.value == undefined ){
          validationCheck = false
          break
        }
      } else {

        if(this.querySelector(`[name='${value}']`)?.value == "" || this.querySelector(`[name='${value}']`)?.value == undefined ){
          validationCheck = false
          break
        }
      }
    }
    return validationCheck
  }

  submitForm(e) {
    e.preventDefault();
    this.submit.classList.add("loading")
    let sensitivity = document.querySelector('input[name="sensitivity_2"]:checked')?.value || 'medium'

    let formula_translate = {
      'mild_2' : 'strong',
      'medium_2': 'medium',
      'very_2': 'sensitive'
    }

    document.cookie =  "strength=" + formula_translate[sensitivity] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"
    document.cookie = "firstname=" + document.querySelector('#first_name_2').value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"
    // document.cookie = "lastname=" + document.querySelector('#last_name_2').value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"

    let ut = getCookie('redirect_ut')
    let ut_direct = getCookie('redirect_ut_direct')

    setTimeout(function(){
      console.log(document.cookie)

      if (ut == 'true' && ut_direct != 'true') {
        window.location = '/products/landing-page-product-main'
      } else {
        window.location = '/products/landing-page-product-main'
      }
    }, 1000);

  }
})