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
      6: {
        "conditions": {
          "shade_2": {}
        }
      },
      10: {
        "conditions": {
          "routine_2": {
            "led_2": "While Whitening Toothpaste removes surface stains, it doesn’t penetrate the teeth and change the color inside. The dentin inside the enamel is the yellow part of the teeth that gives it the yellow hue. That’s where we come in."
          }
        }
      }
    }

    this.setInputs(this.currentStep)

    this.back = this.querySelector("[data-form-back]")
    this.next = this.querySelector("[data-form-next]")
    this.submit = this.querySelector("[data-form-submit]")
    this.begin = this.querySelector("[data-form-begin]")

    this.progress = 0

    this.form = this.querySelector(".quiz_2__form")

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.closeQuiz.bind(this))

    this.allInputs.forEach((input) => {
      input.addEventListener('change', function(e){
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
    this.next.addEventListener('click', this.changeFormStep.bind(this, 1))
    this.close.addEventListener('click', this.closeQuiz.bind(this))
    this.begin.addEventListener('click', this.changeFormStep.bind(this, 1))
    this.submit.addEventListener('click', function(e){
      this.submitForm(e)
    }.bind(this))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue && oldValue != null ) {
      this.querySelector(`.form__step-wrapper_2[data-step="${ oldValue }"`).classList.remove('active')
      this.querySelector(`.form__step-wrapper_2[data-step="${ newValue }"`).classList.add('active')

      if( newValue == 12 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.remove('hidden')
      }
      if ( newValue == 9 && oldValue == 12 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.add('hidden')
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

  changeFormStep(x) {
    let currentState = Number(this.dataset.state)
    let newState = currentState
    if (x == 1) {
      if (currentState in this.feedback_dictionary) {
        let feedbackState = this.feedback_dictionary[currentState]
        let input_name = Object.keys(feedbackState['conditions'])[0]
        let input_value = $(`input[name=${input_name}]`).val()
        console.log('new')
        console.log(feedbackState)
        console.log(input_name)
        console.log(input_value)
        if (feedbackState['conditions'][input_name].length == 0) {
          newState = currentState + 0.5
        } else if (input_value in feedbackState['conditions'][input_name]) {
          newState = currentState + 0.5
          console.log(feedbackState['conditions'][input_name][input_value])
        } else {
          newState = this.normalAdd(x, currentState)
        }
      } else {
        newState = this.normalAdd(x, currentState)
      }
    } else {
      if (currentState - 1 in this.feedback_dictionary) {
        let feedbackState = this.feedback_dictionary[currentState - 1]
        let input_name = Object.keys(feedbackState['conditions'])[0]
        let input_value = $(`input[name=${input_name}]`).val()
        if (feedbackState['conditions'][input_name].length == 0) {
          newState = currentState + 0.5
          console.log('no length')
        } else if (input_value in feedbackState['conditions'][input_name]) {
          newState = currentState + 0.5
          print(feedbackState['conditions'][input_name][input_value])
        } else {
          newState = this.normalAdd(x, currentState)
        }
      } else {
        newState = this.normalAdd(x, currentState)
      }
      // if (currentState - 1 in this.feedback_dictionary) {
      //   if (this.feedback_dictionary[currentState - 1]['conditions'] == 'any') {
      //     newState = currentState - 0.5
      //   } 
      // } else {
      //   newState = this.normalAdd(x, currentState)
      // }
    }

    this.setAttribute('data-state', newState.toString() )

    this.setInputs(newState.toString())
    if(this.validateFormStep(this.inputs) == true) {
      this.next.removeAttribute('disabled')
    } else {
      this.next.setAttribute('disabled', 'true')
    }
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
    document.cookie = "lastname=" + document.querySelector('#last_name_2').value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"

    let ut = getCookie('redirect_ut')
    let ut_direct = getCookie('redirect_ut_direct')

    setTimeout(function(){
      console.log(document.cookie)

      if (ut == 'true' && ut_direct != 'true') {
        window.location = '/products/at-home-whitening-kit-2'
      } else {
        window.location = '/products/at-home-whitening-kit'
      }
    }, 1000);

  }
})