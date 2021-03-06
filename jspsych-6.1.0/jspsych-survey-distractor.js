jsPsych.plugins["survey-distractor"] = (function () {
  var plugin = {};

  plugin.info = {
    name: "survey-distractor",
    description: "",
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: "Questions",
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: "Prompt",
            default: undefined,
            description: "Prompt for the subject to response",
          },
          placeholder: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: "Value",
            default: "",
            description: "Placeholder text in the textfield.",
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: "Rows",
            default: 1,
            description: "The number of rows for the response text box.",
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: "Columns",
            default: 40,
            description: "The number of columns for the response text box.",
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: "Required",
            default: false,
            description: "Require a response",
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: "Question Name",
            default: "",
            description:
              "Controls the name of data values associated with this question",
          },
        },
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Preamble",
        default: null,
        description:
          "HTML formatted string to display at the top of the page above all the questions.",
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "SUBMIT",
        description: "The text that appears on the button to finish the trial.",
      },
      stimulus: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: "Stimulus",
        default: undefined,
        description: "The image to be displayed",
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image height",
        default: null,
        description: "Set the image height in pixels",
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image width",
        default: null,
        description: "Set the image width in pixels",
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
        description: "Maintain the aspect ratio after setting width or height",
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: "Choices",
        default: jsPsych.ALL_KEYS,
        description:
          "The keys the subject is allowed to press to respond to the stimulus.",
      },
      response_next_image: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Response goes to next image",
        default: null,
        description:
          "If true, the next image will appear when subject makes a response.",
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    display_element.innerHTML =
      '<div id="main_task"></div><br></br><br></br><div id="distractor-stimulus-container"></div>';
    display_element_main_task = document.querySelector("#main_task");
    display_element_distractor = document.querySelector("#distractor-stimulus-container");

    //survey
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == "undefined") {
        trial.questions[i].rows = 1;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == "undefined") {
        trial.questions[i].columns = 40;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == "undefined") {
        trial.questions[i].value = "";
      }
    }

    var htmlSurvey = "";
    // show preamble text
    if (trial.preamble !== null) {
      htmlSurvey +=
        '<div id="main_task-preamble" class="main_task-preamble">' +
        trial.preamble +
        "</div>";
    }
    // start form
    htmlSurvey += '<form id="main_task-form" autocomplete="off">';

    // generate question order
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[question_order[i]];
      var question_index = question_order[i];
      htmlSurvey +=
        '<div id="main_task-' +
        question_index +
        '" class="main_task-question" style="margin: 2em 0em;">';
      htmlSurvey +=
        '<p class="jspsych-survey-distractor">' + question.prompt + "</p>";
      var req = question.required ? "required" : "";
      if (question.rows == 1) {
        htmlSurvey +=
          '<input type="text" id="survey-input" autocomplete="off" name="#main_task-response-' +
          question_index +
          '" data-name="' +
          question.name +
          '" size="' +
          question.columns +
          '" ' +
          req +
          ' placeholder="' +
          question.placeholder +
          '"></input>';
      } else {
        htmlSurvey +=
          '<textarea id="survey-input" name="#main_task-response-' +
          question_index +
          '" data-name="' +
          question.name +
          '" cols="' +
          question.columns +
          '" rows="' +
          question.rows +
          '" ' +
          autofocus +
          " " +
          req +
          ' placeholder="' +
          question.placeholder +
          '"></textarea>';
      }
      htmlSurvey += "</div>";
    }

    // add submit button
    htmlSurvey +=
      '<input type="submit" id="main_task-next" class="jspsych-btn main_task" value="' +
      trial.button_label +
      '"></input>';

    htmlSurvey += "</form>";
    display_element_main_task.innerHTML = htmlSurvey;

    //No numbers in textbox function 
    function lettersOnly(input) {
      var regex = /[0-9]/g;
      var input = event.target;
      input.value = input.value.replace(regex, "");
    }

    function preventBackspace(e) {
      var evt = e || window.event;
      if (evt) {
        var keyCode = evt.charCode || evt.keyCode;
        if (keyCode == 8) {
          if (evt.preventDefault) {
            evt.preventDefault();
          } else {
            evt.returnValue = false;
          }
        }
      }
    }


    document.querySelector("#survey-input").addEventListener('keydown', preventBackspace)
    document.querySelector("#survey-input").addEventListener('input', lettersOnly)
    document.getElementById('main_task-form').setAttribute('autocomplete', 'off');
    document.getElementById("survey-input").focus();

    //generate image order
    var image_order = [];
    for (var i = 0; i < trial.stimulus.length; i++) {
      image_order.push(i);
    }
    if (trial.randomize_image_order) {
      image_order = jsPsych.randomization.shuffle(image_order);
    }

    //display distractor stimulus
    var htmlDistractor = "";

    htmlDistractor += '<img id="distractor-stimulus" src="square.png" style="';
    if (trial.stimulus_height !== null) {
      htmlDistractor += "height:" + trial.stimulus_height + "px; ";
      if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
        htmlDistractor += "width: auto; ";
      }
    }
    if (trial.stimulus_width !== null) {
      htmlDistractor += "width:" + trial.stimulus_width + "px; ";
      if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
        htmlDistractor += "height: auto; ";
      }
    }
    htmlDistractor += '"></img>';

    display_element_distractor.innerHTML = htmlDistractor;

    var imgArray = trial.stimulus;
    var curIndex = 0;
    var targetData = [];
    var shapeData = [];
    var distractor_data = [];
    var target_response = [];

    let currentKeypressListener = null;

    //function for oddball task
    function slideShow() {
      console.log(imgArray[curIndex]);

      //slideshow
      curIndex++;
      curIndex = curIndex % imgArray.length;
      document.getElementById("distractor-stimulus").className = "fadeOut";
      setTimeout(function () {
        document.getElementById("distractor-stimulus").className = "";
        document.getElementById("distractor-stimulus").src = imgArray[curIndex];
        //push shapeData
        shapeData.push(imgArray[curIndex])
        target_response.push({ shape: imgArray[curIndex], response: "0" })
        //function to count the amount of time X appears
        function targetArray() {
          var x = imgArray[curIndex];
          if (x == "target.png") {
            targetData.push(x)
          }
        };
        targetArray();
      }, 800);

      //keyboard listener
      if (currentKeypressListener) {
        document.removeEventListener('keypress', currentKeypressListener)
        currentKeypressListener = null
      }

      //when trial.choices is pressed
      const listener = function (e) {
        if (trial.choices.includes(e.code)) {
          console.log(e.code, trial.choices, distractor_data);
          distractor_data.push(imgArray[curIndex])
          document.getElementById("distractor-stimulus").className = "green";
          target_response.push({ shape: imgArray[curIndex], response: "1" })
          document.removeEventListener('keypress', listener)
          currentKeypressListener = null
        }
      }
      currentKeypressListener = listener
      document.addEventListener('keypress', listener)
    };

    const intervalId = setInterval(slideShow, trial.response_next_image);

    // function when you hit submit
    display_element_main_task
      .querySelector("#main_task-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        // measure response time
        var endTime = performance.now();
        var response_time = endTime - startTime;

        document.removeEventListener('keypress', currentKeypressListener)

        // create object to hold responses
        var question_data = {};

        for (var index = 0; index < trial.questions.length; index++) {
          var id = "Q" + index;
          var q_element = document
            .querySelector("#main_task-" + index)
            .querySelector("textarea, input");
          var val = q_element.value;
          var name = q_element.attributes["data-name"].value;
          if (name == "") {
            name = id;
          }
          var obje = {};
          obje[name] = val;
          Object.assign(question_data, obje);
        }

         //clean up target_response data 
         var i = 0;
         while (i < target_response.length) {
           if (target_response[i].response === "1") {
             target_response.splice(i - 1, 1);
           } else {
             ++i;
           }
         }

        // save data
        var trial_data = {
          "rt": response_time,
          "stimulus": JSON.stringify(question.prompt),
          "responses": JSON.stringify(question_data),
          "keyPressed": distractor_data,
          "targetAmount": targetData.length,
          "targetResponse": JSON.stringify(target_response),
          "shapes": shapeData,
        };

        display_element.innerHTML = "";

        // next trial
        clearInterval(intervalId)
        jsPsych.pluginAPI.cancelAllKeyboardResponses();
        jsPsych.finishTrial(trial_data);
      });

    console.log(target_response)

    var startTime = performance.now();
  };

  return plugin;
})();
