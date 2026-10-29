/* Орбіта — інтерактивність дашборда */

const player = document.getElementById("player");
const restartButton = document.getElementById("restart-button");
const likeButton = document.getElementById("like-button");
const likeCount = document.getElementById("like-count");
const saveButton = document.getElementById("save-button");
const shareButton = document.getElementById("share-button");
const actionStatus = document.getElementById("action-status");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");
const emptyMessage = document.getElementById("empty-message");
const cards = document.querySelectorAll(".card");

let likes = 128;

/* Повідомлення для скрінрідерів і користувача */
function say(message) {
    actionStatus.textContent = message;
}

/* Коротка анімація іконки (клас прибирається після завершення) */
function popIcon(button) {
    button.classList.remove("pop");
    void button.offsetWidth; // перезапуск анімації
    button.classList.add("pop");
    button.addEventListener("animationend", () => button.classList.remove("pop"), { once: true });
}

/* Лайк */
likeButton.addEventListener("click", () => {
    const active = likeButton.getAttribute("aria-pressed") !== "true";

    likes += active ? 1 : -1;
    likeCount.textContent = likes;
    likeButton.setAttribute("aria-pressed", String(active));
    likeButton.setAttribute("aria-label", `Подобається: ${likes}`);

    popIcon(likeButton);
    say(active ? "Вам подобається цей урок." : "Лайк прибрано.");
});

/* Зберегти */
saveButton.addEventListener("click", () => {
    const active = saveButton.getAttribute("aria-pressed") !== "true";

    saveButton.setAttribute("aria-pressed", String(active));
    saveButton.setAttribute("aria-label", active ? "Прибрати зі збережених" : "Зберегти урок");

    popIcon(saveButton);
    say(active ? "Урок збережено." : "Урок прибрано зі збережених.");
});

/* Поділитися */
shareButton.addEventListener("click", async () => {
    popIcon(shareButton);

    const data = {
        title: document.title,
        text: "Урок 3. Газові гіганти",
        url: location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(data);
            say("Дякуємо, що поділилися!");
            return;
        }

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(location.href);
            say("Посилання скопійовано.");
            return;
        }
    } catch (error) {
        if (error.name === "AbortError") {
            return; // користувач закрив вікно
        }
    }

    say("Скопіюйте посилання з адресного рядка.");
});

/* Кнопка «Дивитися спочатку» */
restartButton.addEventListener("click", () => {
    player.currentTime = 0;
    player.play().catch(() => {
        say("Натисніть Play у плеєрі, щоб почати відтворення.");
    });
    player.focus();
});

/* Пошук по картках матеріалів */
function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
        const text = `${card.dataset.title} ${card.textContent}`.toLowerCase();
        const matches = text.includes(query);

        card.hidden = !matches;

        if (matches) {
            visible++;
        }
    });

    emptyMessage.hidden = visible !== 0;
    searchStatus.textContent = query ? `Знайдено: ${visible}` : "";
}

searchInput.addEventListener("input", filterCards);
searchForm.addEventListener("submit", (event) => event.preventDefault());