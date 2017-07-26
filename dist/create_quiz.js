'use strict';

/**
 * Created by liao on 2017/6/9.
 */

;(function ($, window, document, undefined) {

    var createQuiz = function createQuiz(ele, json) {
        this.$json = json, this.$element = ele;
    };

    createQuiz.prototype = {

        htmlElementJoint: function htmlElementJoint() {
            var quizJson = this.$json;
            var content = quizJson.content;
            var questions = content.questions;
            var number = questions.length;
            var hasImage = content.quizImageControl ? '' : 'hide';

            var quizHtml = '';

            quizHtml = '<div class="cmsQuiz"><div class="quiz-container-inner"><div class="quiz-title"><div class="quiz-main-title">' + content.title + '</div><div class="quiz-sub-title">' + content.description + '</div></div>' + '<div class="slick-part">';

            $.each(questions, function (key, val) {

                var isShown1 = val.options1 == "" ? 'invisible' : '',
                    isShown2 = val.options2 == "" ? 'invisible' : '',
                    isShown3 = val.options3 == "" ? 'invisible' : '',
                    isShown4 = val.options4 == "" ? 'invisible' : '';

                var noImgClass = '';
                if (!val.img) {
                    noImgClass = 'js-noimg';
                }
                //题目页面
                quizHtml += "<div class='slick-item'>" + "<div class='quiz-image " + hasImage + "'>" + "<img class='" + noImgClass + "' src='" + val.img + "' />" + "</div>" + "<div class='quiz-question'>" + "<div class='quiz-question-num-container'>" + "<div class='quiz-question-num'>" + (key + 1) + "</div>" + "</div>" + "<div class='quiz-question-text'>" + val.question + "</div>" + "<div class='quiz-question-options'>" + "<ul class='quiz-question-options-ul' id='question_" + key + "'>" + "<li class='quiz-question-options-li " + isShown1 + "' id='question_" + key + "_1_li'>" + "<input type='radio' class='magic-radio' name='question_" + key + "' id='question_" + key + "_1_option'>" + "<label class='option-text' for='question_" + key + "_1_option'>" + val.options1 + "</label>" + "</li>" + "<li class='quiz-question-options-li " + isShown2 + "' id='question_" + key + "_2_li'>" + "<input type='radio' class='magic-radio' name='question_" + key + "' id='question_" + key + "_2_option'>" + "<label class='option-text' for='question_" + key + "_2_option'>" + val.options2 + "</label>" + "</li>" + "<li class='quiz-question-options-li " + isShown3 + "' id='question_" + key + "_3_li'>" + "<input type='radio' class='magic-radio' name='question_" + key + "' id='question_" + key + "_3_option'>" + "<label class='option-text' for='question_" + key + "_3_option'>" + val.options3 + "</label>" + "</li>" + "<li class='quiz-question-options-li " + isShown4 + "' id='question_" + key + "_4_li'>" + "<input type='radio' class='magic-radio' name='question_" + key + "' id='question_" + key + "_4_option'>" + "<label class='option-text' for='question_" + key + "_4_option'>" + val.options4 + "</label>" + "</li>" + "</ul>" + "</div>" + "<div class='quiz-process'>" + (key + 1) + "/" + number + "</div>" + "<div class='nextButton onlyNext invisible' id='next_" + key + "'>" + "Next" + "</div>" + "</div>" + "</div>";
            });

            quizHtml += "<div class='slick-item'>" + "<div class='score-div'>" + "<h1>" + "Your Score" + "</h1>" + "<div class='score-part'>" + "<span class='score' id='final-score'>" + 0 + "</span>" + "&nbsp;&nbsp;/&nbsp;&nbsp;" + "<span class='score'>" + number + "</span>" + "</div>" + "<h1>" + "Let your friends and the word know" + "</h1>" + "<div class='icon-list'>" + "<div class='share'>" + "<a class='mail' href='#' target='_blank'><img src='./asset/facebook@3x.png'></a>" + "<a class='mail' href='#' target='_blank'><img src='./asset/twitter@3x.png'/></a>" + "<a class='mail' href='#' target='_blank'><img src='./asset/tumblr@3x.png'/></a>" + "<a class='mail' href='#' target='_blank'><img src='./asset/wechat@3x.png'/></a>" + "<a class='mail' href='#' target='_blank'><img src='./asset/weibo@3x.png'/></a>" + "<a class='mail' href='#' target='_blank'><img src='./asset/mail@3x.png'/></a>" + "</div>" + "</div>" + "</div>" + "<div class='restartButton nextButton' data-restart='true'>" + "Start it again" + "</div>" + "</div>";

            quizHtml += '</div><div class="quiz-result">';

            quizHtml += '' + '</div></div></div>';

            var item = $(quizHtml);

            item[0].dataset.quiz = JSON.stringify(quizJson);

            return this.$element.append(item[0].outerHTML);
        },

        addQuizFunction: function addQuizFunction() {
            this.htmlElementJoint();

            //Slick
            // $('.slick-part').slick({
            //     dots: false,
            //     adaptiveHeight: true,
            //     draggable: false,
            //     nextArrow: $('.nextButton'),
            // });

            //Do Quiz
            var score = 0;

            $('input[type="radio"]').change(function (e) {

                //input选中
                var option_input = e.target;
                var option_input_id = option_input.getAttribute("id");

                //li背景颜色改变
                var option_li = e.target.parentNode;
                var option_li_id = option_li.getAttribute('id');
                $('#' + option_li_id).addClass('option-chosen');

                //ul不能被点击
                var question_id = option_input.getAttribute("name");
                $("#" + question_id).addClass('no-click');

                //答案显示
                var question_answered = option_input_id.split('_')[1];
                var option_choose = option_input_id.split('_')[2];
                var data = JSON.parse($('.cmsQuiz')[0].dataset.quiz);
                var question = data.content.questions[question_answered];
                var result = option_choose == question.rightAnswer ? 'Correct' : 'Wrong';
                var resultclass = option_choose == question.rightAnswer ? 'js-correct' : 'js-wrong';
                var feedback = question.explanation;
                $('.quiz-result').html("<div class='quiz-result-title " + resultclass + "'>" + result + "!" + "</div>" + "<div class='quiz-result-text'>" + feedback + "</div>").fadeIn(200);

                //得分加一
                if (result == 'Correct') {
                    score++;
                }

                //nextButton显示
                $("#next_" + question_answered).removeClass('invisible');

                //分数显示
                $("#final-score").html(score);
            });

            //切换效果
            var quizItem = $('.quiz-container-inner .slick-part .slick-item');
            var quizLength = quizItem.length;
            quizItem.eq(0).fadeIn(200);
            quizItem.each(function (i) {
                var theWrap = $(this);
                $(this).find('.nextButton').click(function () {
                    theWrap.hide();
                    if (i == quizLength - 1) {
                        quizItem.eq(0).fadeIn(200);
                    } else {
                        quizItem.eq(i + 1).fadeIn(200);
                    }
                });
            }

            //题目刷新
            );$('.nextButton').click(function (e) {
                $('.quiz-result').html('').hide();

                if ($(e.target)[0].dataset.restart) {
                    score = 0;
                    $('input[type="radio"]').attr('checked', false);
                    $('.quiz-question-options-ul').removeClass('no-click');
                    $('.quiz-question-options-li').removeClass('option-chosen');

                    $(".onlyNext").addClass('invisible');
                }
            });
        }
    };

    $.fn.createQuiz = function (json) {
        var myQuiz = new createQuiz(this, json);

        return myQuiz.addQuizFunction();
    };
})(jQuery, window, document);
//# sourceMappingURL=create_quiz.js.map