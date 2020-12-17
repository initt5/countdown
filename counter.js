(function() {
    const form = document.forms.date;
    let timer;
    // adds 0 to dates/hours which are < 10
    function transformDate(h) {
        let newH = '';

        if (h < 10) {
            newH = '0'+h;
        }
        
        else {
            newH = h;
        }
        return String(newH)
    }

    function getNow() {
        const date = new Date();
        const today = `${date.getFullYear()}-${transformDate(date.getMonth()+1)}-${transformDate(date.getDate())}T${transformDate(date.getHours())}:${transformDate(date.getMinutes())}:${transformDate(date.getSeconds())}`;
        return today
    }

    //I'm sure that this can be done 10x times better
    function countTime(value) {
        const clock = document.querySelector('#clock');
        const now = new Date(getNow());
        const date = new Date(value);
        const difference = date-now;
        const weeks = Math.floor(difference / (1000*3600*24*7));
        const days = Math.floor((difference % (1000*3600*24*7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const time = new Map([['weeks', weeks], ['days', days], ['hours', hours], ['minutes', minutes], ['seconds', seconds]]);
        if (weeks >= 0 && days >= 0 && minutes >= 0 && seconds >= 0 && hours >= 0) {
            const node = document.querySelector('.time');
            if (!node) {
                for (let entity of time) {
                    let timeElement = document.createElement('div');
                    timeElement.innerHTML = `${transformDate(entity[1])}`;
                    timeElement.className = 'time';
                    timeElement.id = entity[0];
                    clock.appendChild(timeElement);
                }
            } else {
                for (let entity of time) {
                let timeBit = document.querySelector(`#${entity[0]}`);
                    timeBit.innerHTML = `${transformDate(entity[1])}`;
                }
            }
        }
        if (weeks == 0 && days == 0 && minutes == 0 && seconds == 0 && hours == 0) {
            localStorage.removeItem('date');
            clock.innerHTML = '';
        }
    }
    form.button.addEventListener('click', () => {
        const date = form.datetime.value;
        if (!localStorage.getItem('date')) {
            localStorage.setItem('date', date);
            timer = setInterval(() => countTime(date), 500);
        } else {
            localStorage.removeItem('date');
            localStorage.setItem('date', date);
            clearInterval(timer);
            timer = setInterval(() => countTime(date), 500);

        }
    });
    window.addEventListener('load', () => {
        const date = localStorage.getItem('date');
        if (localStorage.getItem('date') != null) {
            form.datetime.value = date;
            clearInterval(timer);
            timer = setInterval(() => countTime(date), 500);
        } 
    });
})()