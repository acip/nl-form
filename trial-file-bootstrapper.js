"use strict";


var state = {
    nStim: 2,
    stimType: 'images',
    stimFormat: 'jpg',
    presType: 'simultaneously',
    presTimeType: 'unlimited',
    presTime: 1000,
    nScreens: 2,
    isi: 500,
    withMask: 'no',

    showTrialText: 'do not want',
    trialText: 'Text to appear on this trial',

    enableResponses: 'can',
    responseMethod: 'pressing keys',
    keys: 'a,s,d',//['a', 's','d'],
    buttons: 'Left, Right',//['LEFT', 'RIGHT'],
    responseLengthType: 'short',
    audioVideoResponseTiming: 'after stimuli end',
    showResponseWindow: 'no',
    responseWindow: 1000,

    hasCorrectResponse: 'a',
    enableFeedbackAfterTrial: 'will not',
    feedbackFor: 'all',
    feedbackForSpecific: 'a',

    nIntructionTrials: 1,
    nPracticeTrials: 0,
    nTrials: 5,

    shouldRandomize: 'should not',
    trialTypeSelector: 'test',
    formStimSelector: 0,
    formCanRespond: 'can',
    formResponseType: 'radio',
    formResponseOptions: 2,
    formSliderStart: 0,
    formSliderEnd: 100,
    formSliderSteps: 1,
    formResponseRandom: 0,
    formHasResponseRows: 0,
    formResponseRows: 2,
    formRandomize: 0,
    formScreenType: 'separate',
    formScreenDivider: 'with',
};

var decisionTree = [];

var $container = $("#trialBootstrapper");

function init(state, decisionTree) {
    decisionTree.push(
        {
            templateId: "trialTypeSelector",
            preCondition: function (currentState) {
                return true;
            },
            source: [
                { value: 'test', text: 'experimental trials' },
                { value: 'form', text: 'survey questions' },
            ]
        },
        {
            templateId: "nStimTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test';
            },
            source: [
                { value: '1', text: '1' },
                { value: '2', text: '2' },
                { value: '3', text: '3' },
                { value: '4', text: '4' },
                { value: '5', text: '5' },
                { value: '6', text: '6' },
            ]
        },
        {
            templateId: "stimTypeTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test';
            },
            source: [
                { value: 'images', text: 'images' },
                { value: 'words', text: 'words' },
                { value: 'sounds', text: 'sounds' },
                { value: 'videos', text: 'videos' }
            ]
        },
        {
            templateId: "stimFormatTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.stimType === 'images';
            },
            source: [
                { value: 'jpg', text: 'jpg' },
                { value: 'png', text: 'png' },
                { value: 'bmp', text: 'bmp' },
                { value: 'gif', text: 'gif' }
            ]
        },
        {
            templateId: "stimAudioFormat",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.stimType === 'sounds';
            }
        },
        {
            templateId: "stimVideoFormat",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.stimType === 'videos';
            }
        },
        {
            templateId: "presTypePreTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && (currentState.stimType == 'words'
                    ||
                    currentState.stimType == 'images')
            }
        },
        {
            templateId: "presTypeTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.nStim > 1
                    &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images')
            },
            source: [
                { value: 'simultaneously', text: 'simultaneously' },
                { value: 'sequentially', text: 'sequentially' }
            ]
        },
        {
            templateId: "presTimeType",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && (currentState.presType == 'simultaneously'
                    || currentState.nStim == 1)
                    &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images')
            },
            source: [
                { value: 'unlimited', text: 'unlimited' },
                { value: 'a limited', text: 'a limited' }
            ]
        },
        {
            templateId: "presTimeSim",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType == 'simultaneously' && currentState.presTimeType == 'a limited' &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            }
        },
        {
            templateId: "presTimeEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType == 'simultaneously' && currentState.presTimeType == 'unlimited' &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            }
        },
        {
            templateId: "withMask",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType == 'simultaneously' && currentState.presTimeType == 'a limited' &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            },
            source: [
                { value: 'no', text: 'no' },
                { value: 'a', text: 'a' }
            ]
        },
        {
            templateId: "nScreensTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.nStim > 1 && currentState.presType === 'sequentially' &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            },
            source: function () {
                var data = [];
                for (var index = 2; index <= window.state.nStim; index++) {
                    data.push({ value: index, text: index });
                }
                console.log(data);
                return data;
            }
        },
        {
            templateId: "presTimeTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType === 'sequentially'
                    && currentState.nStim > 1 &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            },
        },
        {
            templateId: "isiTemplate",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType === 'sequentially' && currentState.nScreens > 1 &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            },
        },
        {
            templateId: "withMaskSeq",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.presType == 'sequentially' && currentState.nScreens > 1 &&
                    (currentState.stimType == 'words'
                        ||
                        currentState.stimType == 'images');
            },
            source: [
                { value: 'no', text: 'no' },
                { value: 'a', text: 'a' }
            ]
        },
        {
            templateId: "showTrialText",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test'
            },
            source: [
                { value: 'do not want', text: 'do not want' },
                { value: 'want', text: 'want' }
            ]
        },
        // {
        // 	templateId: "trialText",
        // 	preCondition: function (currentState) {
        // 		return currentState.showTrialText == 'want'
        // 	},
        // },
        {
            templateId: "noTrialTextEnd",
            preCondition: function (currentState) {
                // return currentState.showTrialText == 'do not want'
                return currentState.trialTypeSelector == 'test'
            },
        },
        {
            templateId: "enableResponses",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test'
            },
            source: [
                { value: 'can', text: 'can' },
                { value: 'cannot', text: 'cannot' }
            ]
        },
        {
            templateId: "responseMethod",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can'
            },
            source: function () {
                var options = [
                    { value: 'pressing keys', text: 'pressing keys' },
                    { value: 'clicking buttons', text: 'clicking buttons' },
                ];

                if (
                    (window.state.presType == 'simultaneously' && window.state.nStim > 1 && state.presTimeType == 'unlimited')
                    ||
                    (window.state.presType == 'sequentially' && window.state.nStim > window.state.nScreens)
                ) {
                    if (window.state.stimType !== 'sounds' && window.state.stimType !== 'videos') {
                        options.push({ value: 'clicking the stimuli', text: 'clicking the stimuli' })
                    }
                }

                options.push({ value: 'typing', text: 'typing' })

                return options;
            }
        },
        {
            templateId: "keys",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.responseMethod == 'pressing keys'
            }
        },
        {
            templateId: "buttons",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.responseMethod == 'clicking buttons'
            }
        },
        {
            templateId: "responseLengthType",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.responseMethod == 'typing'
            },
            source: [
                { value: 'short', text: 'short' },
                { value: 'long', text: 'long' }
            ]
        },
        {
            templateId: "audioVideoResponseTiming",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can'
                    &&
                    (currentState.stimType == 'sounds'
                        ||
                        currentState.stimType == 'videos')
            },
            source: [
                { value: 'after stimuli end', text: 'after stimuli end' },
                { value: 'while stimuli are', text: 'while stimuli are' }
            ]
        },
        {
            templateId: "noResponseEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'cannot' || currentState.responseMethod == 'clicking the stimuli'
            }
        },
        {
            templateId: "showResponseWindow",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses != 'cannot';
            },
            source: [
                { value: 'no', text: "no" },
                { value: 'a', text: 'a' }
            ]
        },
        {
            templateId: "responseWindow",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.showResponseWindow == 'a' && currentState.enableResponses != 'cannot';
            },
        },
        {
            templateId: "noResponseWindowEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.showResponseWindow == 'no' && currentState.enableResponses != 'cannot';
            }
        },
        {
            templateId: "hasCorrectResponse",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can'
            },
            source: [
                { value: 'a', text: 'a' },
                { value: 'no', text: 'no' }
            ]
        },
        {
            templateId: "enableFeedbackAfterTrial",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can';
            },
            source: [
                { value: 'will', text: 'will' },
                { value: 'will not', text: 'will not' }
            ]
        },
        {
            templateId: "feedbackFor",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.enableFeedbackAfterTrial == 'will';
            },
            source: function () {
                const currentState = window.state;

                var options = [
                    { value: 'all', text: 'all' },
                ];

                if (currentState.hasCorrectResponse == 'a') {
                    options.push({ value: 'correct', text: 'correct' });
                    options.push({ value: 'incorrect', text: 'incorrect' });
                    options.push({ value: 'correct and incorrect', text: 'correct and incorrect' });
                }

                options.push({ value: 'specific', text: 'specific' });

                return options;
            }
        },
        {
            templateId: "feedbackForSpecific",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.feedbackFor == 'specific' && currentState.responseMethod != 'typing';
            },
            source: function () {
                const currentState = window.state;

                var options = [];
                if (currentState.responseMethod == 'pressing keys') {
                    var keys = currentState.keys.split(',');
                    for (var i = 0; i <= keys.length; i++) {
                        options.push({ value: keys[i], text: keys[i] });
                    }
                }
                else if (currentState.responseMethod == 'clicking buttons') {
                    var buttonsCount = currentState.buttons.split(',').length;
                    for (var i = 1; i <= buttonsCount; i++) {
                        options.push({ value: i, text: i });
                    }
                }
                else if (currentState.responseMethod == 'clicking the stimuli') {
                    var stimCount = currentState.nStim;
                    for (var i = 1; i <= stimCount; i++) {
                        options.push({ value: i, text: i });
                    }
                }

                return options;
            }
        },
        {
            templateId: 'feedbackForSpecificEnd',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.hasCorrectResponse == 'a' && currentState.feedbackFor != 'all' && currentState.feedbackFor != 'correct and incorrect';
            },
        },
        {
            templateId: "feedbackForEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.hasCorrectResponse == 'a';
            },
        },
        {
            templateId: "feedbackEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can' && currentState.hasCorrectResponse == 'a';
            }
        },
        {
            templateId: "hasCorrectResponseEnd",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.hasCorrectResponse == 'no'
            },
        },
        {
            templateId: "trialsInstructions",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test'
            }
        },
        {
            templateId: "trialsPractice",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test' && currentState.enableResponses == 'can'
            }
        },
        {
            templateId: "trialsMain",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'test';
            }
        },
        {
            templateId: "formStimSelector",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form';
            },
            source: [
                { value: 0, text: 'text only' },
                { value: 1, text: 'text and one image' },
                { value: 2, text: 'text and two images' },
                { value: 3, text: 'text and three images' },
            ]
        },
        {
            templateId: "formCanRespond",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form';
            },
            source: [
                { value: 'cannot', text: 'cannot' },
                { value: 'can', text: 'can' },
                { value: 'must', text: 'must' },
            ]
        },
        {
            templateId: "cannotRespond",
            preCondition: function (currentState) {
                return currentState.formCanRespond == 'cannot' && currentState.trialTypeSelector == 'form';
            }
        },
        {
            templateId: 'formResponseType',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot';
            },
            source: [
                { value: 'radio', text: 'multiple choice' },
                { value: 'checkboxes', text: 'checkboxes' },
                { value: 'dropdown', text: 'dropdown' },
                { value: 'box', text: 'short text input' },
                { value: 'comment', text: 'long text input' },
                { value: 'slider', text: 'slider' },
                { value: 'rank', text: 'ranking' },
            ]
        },
        {
            templateId: 'formResponseOptions',
            preCondition: function (currentState) {
                var type = currentState.formResponseType;
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && !['slider', 'comment', 'box'].includes(type);
            }
        },
        {
            templateId: 'formSliderOptions',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && currentState.formResponseType == 'slider';
            }
        },
        {
            templateId: 'formSliderStart',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && currentState.formResponseType == 'slider';
            }
        },
        {
            templateId: 'formSliderEnd',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && currentState.formResponseType == 'slider';
            }
        },
        {
            templateId: 'formSliderSteps',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && currentState.formResponseType == 'slider';
            }
        },
        {
            templateId: 'formResponseRandom',
            preCondition: function (currentState) {
                var type = currentState.formResponseType;
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && !['slider', 'comment', 'box'].includes(type);
            },
            source: [
                { value: 0, text: 'fixed' },
                { value: 1, text: 'randomized' },
            ]
        },
        {
            templateId: 'formHasResponseRows',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot';
            },
            source: [
                { value: 0, text: 'don\'t have' },
                { value: 1, text: 'have' },
            ]
        },
        {
            templateId: 'formResponseRows',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot' && currentState.formHasResponseRows == 1;
            },
        },
        {
            templateId: 'formRowsEnd',
            preCondition: function (currentState) {
                var type = currentState.formResponseType;
                return currentState.trialTypeSelector == 'form' && currentState.formCanRespond != 'cannot';
            }
        },
        {
            templateId: 'formScreenType',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form';
            },
            source: [
                { value: 'same', text: 'the same screen' },
                { value: 'separate', text: 'separate screens' }
            ]
        },
        {
            templateId: 'formSameScreenDivider',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form' && currentState.formScreenType == 'same';
            },
            source: [
                { value: 'with', text: 'with' },
                { value: 'without', text: 'without' }
            ]
        },
        {
            templateId: 'formRandomize',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form';
            },
            source: [
                { value: 0, text: 'fixed' },
                { value: 1, text: 'random' }
            ]
        },
        {
            templateId: 'formScreenEnd',
            preCondition: function (currentState) {
                return currentState.trialTypeSelector == 'form';
            }
        },
        {
            templateId: "shouldRandomize",
            preCondition: function (currentState) {
                return currentState.trialTypeSelector != 'form';
            },
            source: [
                { value: 'should not', text: 'fixed' },
                { value: 'should', text: 'random' }
            ]
        },
    );

    $container.on('focus', 'a', function (e) {
        e.stopPropagation();
        $(this).editable('toggle');
    });
}


init(state, decisionTree);

$(function () {
    run(state);
});



function run(state) {

    console.log('eee');
    if (!run.currentPosition) {
        run.currentPosition = 0;
    }

    clearContainer();

    for (var i = 0; i < decisionTree.length; i++) {
        var option = decisionTree[i];
        if (option.preCondition(state)) {
            var $templateElement = templateForOption(option);
            var $optionElement = defaultTemplateFormatter(option, state, $templateElement);
            //may be needed later
            option.$optionElement = $optionElement;

            appendOptionElement(option.$optionElement);

            run.currentPosition = i + 1;
        }
    }

    addOverlay();

    var nlform = new NLForm(document.getElementById('nl-form'));
}

function addOverlay() {
    if ($('#nl-form .nl-overlay').length == 0) {
        $('#nl-form').append('<div class="nl-overlay"></div>');
    }
}
function getStateFieldProperty(element) {
    return window.state[element.getAttribute('data-name')];
}

function appendOptionElement(element) {
    window.$container.append(element);
}

function clearContainer() {
    window.$container.html('');
}

function templateForOption(option) {
    if (!templateForOption.templatesContainer) {
        templateForOption.templatesContainer = $("#quick-project-templates");
    }

    return templateForOption.templatesContainer.find("#" + option.templateId);
}

function setStateProperty(key, value) {
    //save ints as int
    if ($.type(value) === "string" && value.match(/^\d+$/)) {
        var intValue = parseInt(value);
        if (!isNaN(intValue)) {
            value = intValue;
        }
    }

    window.state[key] = value;

    run(window.state);
}

function defaultTemplateFormatter(option, currentState, $template) {
    var $newTemplate = $template.clone();
    var $inputs = $newTemplate.find('a');

    $inputs.each(function (index, a) {
        var $a = $(a);
        var type = $a.data('type');
        var name = $a.data('name');
        var value = currentState[name];
        var $input;

        if (type == 'select') {
            var options = typeof option.source === 'function' ? option.source() : option.source;
            $input = generateSelectInput(value, name, options);
        } else {
            $input = generateInput(value, name, $a.data('subline'));
        }

        $input.on('change', function () {
            setStateProperty(this.getAttribute('name'), this.value);
        })

        $a.replaceWith($input)
    });

    return $newTemplate;

    function generateInput(value, name, subline) {
        return $('<input>', {
            value: value,
            name: name,
            placeholder: '',
            'data-subline': subline ? subline : undefined,
            'data-class': subline ? 'long' : '',
        });
    }

    function generateSelectInput(value, name, options) {
        var $select = $('<select>', {
            value: value,
            name: name
        });

        options.forEach(function (option) {
            $select.append($('<option>', {
                value: option.value,
                text: option.text,
                selected: value == option.value ? 'selected' : undefined
            }));
        });

        return $select;
    }
}
