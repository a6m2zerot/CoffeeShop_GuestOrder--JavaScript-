window.addEventListener("DOMContentLoaded", ()=> {
    "use strict";

    const totalPrice = document.querySelector(".total");
    const btn = document.querySelector(".button");          
    const wrapper = document.querySelector(".wrapper");


    const getData = async(url) => {  //! Получаем данные из json-файла
        const request = await fetch(url);
        if (!request.ok) {
            alert(`Ошибка в запросе к JSON по пути ${url}`);
        } else {
            return await request.json();
        }
    }

    const renderGoodsItems = (goods) => {  //! Рендерим верстку из полученных данных
        goods.forEach((good) => {
            const {
                name,
                id,
                price,
        } = good;
        const listItem = document.createElement('div');
        listItem.className = "goods_item";
        const content = `
        <input type="checkbox" id="${id}" name="good" value="${price}">
        <label for="${id}">${name}</label>
        <input type="text" class="input" placeholder="0" value="0" readonly>
        `
        listItem.insertAdjacentHTML("beforeend", content);
        wrapper.insertAdjacentElement("beforeend", listItem);
        })
    }



    getData("./db/items.json") //! Сообщаем адрес в функцию getData()
    .then((goods) => { 
        renderGoodsItems(goods)
        const goodsItems = document.querySelectorAll(".goods_item");
        return goodsItems
    })
    .then((goodsItems) => {
        //* Если нажать чекбокс, то откроется возможность указать кол-во
        goodsItems.forEach((elem) => {
            const inputs = elem.querySelectorAll("input");
            inputs[1].value = null;
            inputs[0].addEventListener("click", ()=> {
                if (inputs[0].checked) {
                    inputs[1].readOnly = false;
                    inputs[1].value = 1;
                } else {
                    inputs[1].readOnly = true;
                    inputs[1].value = null;
                    inputs[1].style.backgroundColor = "white"
                }
            })
        });
            //* Подсчет итоговой стоимости заказа
        const countTotalPrice = () => {
            let total = 0;
            let errors = []
            goodsItems.forEach(elem => {
                const labels = elem.querySelectorAll("label");
                const inputs = elem.querySelectorAll("input");
                if (inputs[0].checked) {
                    //* Проверка на корректный ввод значений
                    if (inputs[1].value >= 0 && inputs[1].value % 1 == 0 && inputs[1].value != "") {
                        total += Number(inputs[0].value) * Number(inputs[1].value)
                        totalPrice.textContent = Intl.NumberFormat("ru").format(total); 
                    } else {
                        errors.push(labels[0].innerText) // Собирает ошибки в массив errors
                    }
                }
            })
            //* Вывод ошибок через функцию openModal()
            if (errors.length > 0) {
                console.log(errors, "errors")
                errors.forEach((error) => {
                    let text = document.createElement("p");
                    text.className = "modal-text";
                    const content = `${error}`
                    text.insertAdjacentHTML('beforeend', content);
                    modalHeader.insertAdjacentElement('afterend', text);
                })
                openModal();
                errors = [] /* Обнуляем массив с товарами, в которых были ошибки при вводе */
            }
        };

        //* Если ВСЕ чекбоксы пустые, то итоговая стоимость будет стоимость равна 0
        const ifAllEmpty = () => {
            let counter = 0;
            goodsItems.forEach(elem => {
                const inputs = elem.querySelectorAll("input");
                if (inputs[0].checked) {
                    counter += 1;  
                }
            })
            if (counter < 1) {
                totalPrice.textContent = 0;
            }
        };

        //* Заливает красным цветом некорректные поля ввода
        const redColorMistakes = () => {
            goodsItems.forEach(elem => {
                const inputs = elem.querySelectorAll("input");
                if (inputs[0].checked) {
                    if (inputs[1].value < 0 || inputs[1].value % 1 != 0 || inputs[1].value == "") {
                        inputs[1].style.backgroundColor = "#F64A46"
                    } else {
                        inputs[1].style.backgroundColor = "white"
                    }
                }
            })
        };
            //* Кнопка "Рассчитать итоговую сумму"
            btn.addEventListener('click', () => {
                countTotalPrice();
                redColorMistakes();
                ifAllEmpty();
        });
    });


    
    //! Запуск модального окна
    const modal = document.querySelector('.modal-container');
    const closeModalButton = document.querySelector('.close');
    const modalHeader = document.querySelector('.modal-header');

    const openModal = function() {
        modal.classList.add('is-open')
       }
    const closeModal = function() {
        modal.classList.remove('is-open')
        /* Убираем ранее созданные строки товаров с ошибками при вводе */
        const removeAllAdded = document.querySelectorAll(".modal-text");
        removeAllAdded.forEach((elem) => {
            elem.remove()
        })
       }
    closeModalButton.addEventListener('click', closeModal)  
});

