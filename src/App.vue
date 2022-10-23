
<template>
  <div class="container">
    <h1>{{ FIO }}</h1>
    <h2>Тест по географии</h2>
    <main>
      <section class="questionsContainer">
        <article class="form-check singleQuestion" v-for="(q, i) in questions" :key="i">
          <h3>{{ q.q }}</h3>
          <div class="form-check" v-for="(a, j) in q.a" :key="j">
            <input class="form-check-input" type="radio" :name="'q' + i" :value="j" :disabled="isCheckingMode"
              @change="handleRadioChanged($event, i)" :checked="answers.get(i) === j">
            <label class="form-check-label" :for="'q' + i">
              {{ a }}
            </label>
          </div>
        </article>
      </section>
      <section class="buttonContainer">
        <button type="button" class="btn btn-success" @click="handleCheckButtonClick"
          :disabled="answers.size !== questions.length || isCheckingMode">Проверить</button>
        <button type="button" class="btn btn-success" @click="handleResetButtonClick">Сбросить</button>
      </section>
      <template v-if="isCheckingMode">
        <section class="results">
          <p>{{ resultText }}</p>
        </section>
        <section class="feedback">
          <p v-if="feedbackHasSent">Отзыв отправлен автору, если блокировщик рекламы не запретил это сделать.
          </p>
          <template v-else>
            <div>
              <input type="text" class="form-control" id="feedbackInput" placeholder="Отзыв для автора"
                autocomplete="off" v-model="feedbackText">
            </div>
            <button type="button" class="btn btn-success" @click="hanldeSendFeedback"
              :disabled="!feedbackText.length">Отправить</button>
          </template>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { questions } from "@/questions";
import "bootstrap/dist/css/bootstrap.min.css";
import { computed, nextTick, ref } from "vue";

const { VITE_STUDENT_SURNAME, VITE_STUDENT_NAME, VITE_STUDENT_LASTNAME } = import.meta.env;
const FIO = [VITE_STUDENT_SURNAME, VITE_STUDENT_NAME, VITE_STUDENT_LASTNAME].join(" ");

const feedbackText = ref("");
const answers = ref(new Map<number, number>());
const isCheckingMode = ref(false);
const feedbackHasSent = ref(false);

const urlBase = `https://api.telegram.org/bot${import.meta.env.VITE_TGBOT_API_KEY}/sendMessage?chat_id=${import.meta.env.VITE_TGGROUP_ID}&text=`;

const handleCheckButtonClick = async () => {
  isCheckingMode.value = true;
  const messageForSend = `[Якушин] Кто-то прошёл тест c результатом "${resultText.value}".`;
  fetch(urlBase + messageForSend);
  await nextTick();
  window.scrollTo(0, document.body.scrollHeight);
}
const handleResetButtonClick = () => {
  answers.value.clear();
  isCheckingMode.value = false;
  feedbackHasSent.value = false;
}
const handleRadioChanged = (e: any, questionIndex: number) =>
  answers.value.set(questionIndex, +e.target.value);

const resultText = computed<string>(() => {
  const rightCount = [...answers.value].filter(([qi, ai]) => questions[qi].rightAnswerIndex === ai).length;
  return rightCount === questions.length ? "Всё правильно" : `Правильно ${rightCount}/${questions.length}`;
});

const hanldeSendFeedback = () =>
  fetch(urlBase + "[Якушин] Отзыв: " + feedbackText.value).then(() => {
    feedbackText.value = "";
    feedbackHasSent.value = true;
  });

</script>


<style lang="scss">
.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding-top: 15px;
}

.questionsContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.singleQuestion {
  border: 1px solid var(--bs-blue);
}

.feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
