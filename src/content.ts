const FORM_ELEMENTS = ['input', 'textarea', 'select'];
const DEFAULT_FORM_VALUES = {
    "first-name": "James",
    "last-name": "Bond",
    "country": "Great Britain",
    "comments": true,
    "offers": true,
    "push-email": true,
}
const MOUSE_CLICK_EVENTS = ['mousedown', 'click', 'mouseup'];

window.addEventListener('load', (event) => {
    const observer = new MutationObserver((mutations, obs) => {
        const root = document.getElementById('root');
        if (root?.childNodes.length) {
            addFormInputsListeners({ elements: FORM_ELEMENTS });
            addSaveButtonListener();
            addAutomateListener();
            obs.disconnect();
            return;
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
});

function addFormInputsListeners({ elements }: any): void {
    elements.forEach((element: any, index: any) => {
        Array.from(document.getElementsByTagName(element)).forEach(inputElem => {
            inputElem.addEventListener('change', (event: { target: HTMLInputElement; }) => {
                const element = event.target as HTMLInputElement
                const value = event.target.type === 'checkbox' ? element.checked : element.value;
                console.log('changed element', element);
                console.log('changed element value is', value);
            });
        });
    });

    // watch on the age input since does not respond on the change event from above
    const target = document.querySelector('input[name="age"]') as HTMLInputElement;
    const observer = new MutationObserver((mutations, obs) => {
        console.log('changed element', target);
        console.log('changed element value is', target.value);
    });
    observer.observe(target, {
        attributes: true,
        childList: true,
        characterData: true
    });
}

function addSaveButtonListener(): void {
    const form = document.getElementById('form') as HTMLFormElement;
    form.addEventListener('submit', (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const dataForm = new FormData(form);
        console.log(Object.fromEntries(dataForm));
    });
}

function addAutomateListener(): void {
    const automate = document.getElementById('automate') as HTMLButtonElement;
    automate.addEventListener('click', () => {
        populateRegularInputs();
        // needs special care because it is a react material ui element
        populateAgeInput();
    });
}

function populateRegularInputs(): void {
    for (const [id, value] of Object.entries(DEFAULT_FORM_VALUES)) {
        let elem = document.getElementById(id) as HTMLFormElement;
        if (elem.getAttribute('type') !== "checkbox" && elem.getAttribute('type') !== "radio") {
            elem.value = value;
        } else {
            elem.checked = value;
        }
    }
}

function populateAgeInput(): void {
    const simpleSelect = document.getElementById('demo-simple-select') as HTMLElement;
    // open select options
    simulateMouseClick(simpleSelect);

    // select the 37 option after 100 ms to be sure that we have the html element in DOM
    setTimeout(() => {
        const secondOoption = document.querySelector('li[data-value="37"]') as HTMLElement;
        clickOnSecondOption(secondOoption);
    }, 100);
}

function simulateMouseClick(element: HTMLElement): void {
    // we do this because as I found out on stackoverflow: React tracks the mousedown and mouseup events for detecting mouse clicks
    MOUSE_CLICK_EVENTS.forEach(mouseEventType =>
        element.dispatchEvent(
            new MouseEvent(mouseEventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            })
        )
    );
}

function clickOnSecondOption(element: HTMLElement): void {
    element.click();
}