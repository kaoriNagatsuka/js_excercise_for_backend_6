// import { isMainThread } from "worker_threads";

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

// クイズデータ、正解数、回答数を保持するオブジェクト
const GameState = {
    quizz: [],
    correctOfNumber: 0,
    quizOfNumber: 0
}

// IDのあるDOMを取得
const questionElement = document.getElementById('question');
const answerContainer = document.getElementById('answers');
const restartButton = document.getElementById('restart-button');

// quiz.ejs ページを開かれたらクイズデータを更新する #2
// https://github.com/kaoriNagatsuka/js_excercise_for_backend_6/issues/2
window.addEventListener('load', () => {
    fetchQuiz();
});

// quiz.ejs restartボタンを押されたらクイズデータを更新する #3
restartButton.addEventListener('click', () => {
    fetchQuiz();
});

const fetchQuiz = async () => {
    questionElement.textContent = 'Now loading...';
    restartButton.hidden = true;

    try {
        // クイズデータを取得
        const response = await fetch(API_URL);
        const data = await response.json();
        const results = await data.results;

        // ステータスを更新(初期化)
        GameState.quizz = results;
        GameState.correctOfNumber = 0;
        GameState.quizOfNumber = 0;
        setNextQuiz(GameState.quizz[GameState.quizOfNumber]);

    } catch (error) {
        alert(error.message);
    }
};

const setNextQuiz = (quiz) => {
    questionElement.textContent = unescapeHTML(quiz.question);
    const answers = shuffleAnswers(quiz);
    const correctAnswer = unescapeHTML(quiz.correct_answer);
    answers.forEach(answer => {
        const answerElemenet = document.createElement('li');
        answerElemenet.classList.add('button');
        answerElemenet.textContent = unescapeHTML(answer);
        answerContainer.appendChild(answerElemenet);

        // quiz.ejs 正解した場合、不正解だった場合でalertのメッセージを変える #8
        answerElemenet.addEventListener('click', (event) => {
            let str = '';
            if (event.target.textContent === correctAnswer) {
                str = 'Correct Answer!';
                GameState.correctOfNumber++;
            } else {
                str = `Wrong Answer...(The correct answer is ${correctAnswer})`;
            }
            // quiz.ejs 問題は答える度に更新される #6
            GameState.quizOfNumber++;
            alert(str);
            DeleteAllAnswers();
        });
    });
};

// quiz.ejs クイズの選択肢は毎回正解の選択肢の位置を変える #4
// 回答選択肢をシャッフル
const shuffleAnswers = (quiz) => {
    const answers = [quiz.correct_answer, ...quiz.incorrect_answers];
    return shuffleArray(answers);
};
// 配列をシャッフルする関数
const shuffleArray = (array) => {
    // 配列が上書きされないようにコピー
    const copiedArray = array.slice();

    // ランダムな位置に入れ替え（シャッフル）
    for (let i = 0; i < copiedArray.length; i++) {
        const rand = Math.floor((Math.random()) * (i + 1));
        [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]];
    }
    return copiedArray;
};

// 正答率を表示する前に選択肢を消す
const DeleteAllAnswers = () => {
    questionElement.textContent = '';
    while (answerContainer.firstChild) {
        answerContainer.removeChild(answerContainer.firstChild);
    }
    // 出題数 < クイズ数の時は次の問題を表示
    // そうでない時は結果を表示
    if (GameState.quizOfNumber < GameState.quizz.length) {
        setNextQuiz(GameState.quizz[GameState.quizOfNumber]);
    } else {
        finishedQuiz();
    }
};
// クイズを答え終わったら正答率を表示する #9
const finishedQuiz = () => {
    questionElement.textContent = `${GameState.correctOfNumber}/${GameState.quizz.length}`;
    restartButton.hidden = false;
};
// unescapeHTML関数を実装する #10
const unescapeHTML = (str) => {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/ /g, "&nbsp;")
        .replace(/\r/g, "&#13;")
        .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
};
