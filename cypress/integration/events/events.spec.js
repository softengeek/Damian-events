const getDate = (date) => {
    let today = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return today.toLocaleDateString(undefined, options);
}

const getCalendarClass = (date) => {
    return `.vc-grid-cell span[aria-label*="${getDate(date)}"]`;
}

const getEventDateClass = (date) => {
    return `div[data-test="event-card"] span[aria-label="Event date is ${date}"]`;
}

describe('Select a specific date from the calendar', () => {
    beforeEach(() => {
        cy.visit('/');
    })

    it('Does have events on the specific date', () => {

        cy.get(getCalendarClass('November 28, 2021'))
            .click();

        cy.get(getEventDateClass('Sun Nov 28 2021'))
            .each((ele) => {
                cy.get(ele).should('be.visible');
            });

    })

    it('Does not have events on the specific date', () => {

        cy.get(getCalendarClass('November 29, 2021'))
            .click();

        cy.contains('Monday, November 29, 2021')
            .should('be.visible');

        cy.get('section svg')
            .should('be.visible');

        cy.get('h1.text-theme')
            .contains('No events found')
            .should('be.visible');

    })
})

describe('Current date is November 20th, 2021', () => {
    beforeEach(() => {
        cy.visit('/');
    })

    it('Does Search for Tokyo', () => {
        cy.get(getCalendarClass('November 20, 2021'))
            .click();

        cy.get('input[aria-label="Search text input"]')
            .type('Tokyo')

        cy.get('.search__button')
            .click();

        cy.get(getEventDateClass('Sat Nov 20 2021'))
            .should('be.visible')
            .its('length')
            .should('eq', 1);
    })

    it('Selects the "Model UN" organization from the Filter by Organization dropdown!', () => {
        cy.get(getCalendarClass('November 28, 2021'))
            .click();

        cy.get(getEventDateClass('Sun Nov 28 2021'), { timeout: 2000 })
            .should('be.visible');

        cy.get('#orgSelect')
            .select(12);

        cy.get('div[data-test="organisation"]')
            .contains('Model UN')
            .should("have.length", 1);
    })

    it('Clicks on "Today\'s Events"', () => {

        cy.get('.nav-link[title*="Today’s Events"]')
            .click();


        cy.get(getEventDateClass('Wed Dec 1 2021'))
            .should('be.visible')
            .should('have.length', 1);

    })

})

describe('Current date is September 2nd, 2021', () => {
    // beforeEach(() => {
    // })

    it('Clicks on Featured Events!', () => {

        cy.get('.nav-link[title="Featured Events"]', { timeout: 2000 })
            .should('be.visible')
            .click();

        cy.contains('Featured Events')
            .should('be.visible');

        cy.get('section svg')
            .should('be.visible');

        cy.get('h1.text-theme')
            .contains('There are no upcoming featured events')
            .should('be.visible');

    })

    it('Clicks on September 2nd, Events', () => {

        cy.get('.vc-arrows-container div:first-child')
            .click();

        cy.get('.vc-arrows-container div:first-child')
            .click();

        cy.get(getCalendarClass('September 2, 2021'))
            .click();

        cy.contains('Thursday, September 2, 2021')
            .should('be.visible');

        cy.get('section svg')
            .should('be.visible');

        cy.get('h1.text-theme')
            .contains('No events found')
            .should('be.visible');

    })

    it('Clicks on the QA Task Submission event card', () => {
        cy.visit('/')

        cy.get(getCalendarClass('November 28, 2021')).click();

        cy.get('.card-content a[aria-label="Event name: QA Task Submission"]', { timeout: 2000 }).should('be.visible').click();

        cy.get('#main-content div > button').contains('Add to calendar').should('be.visible');
        cy.get('#main-content div > a button').contains('Add to Google Calendar').should('be.visible');

        cy.get('div[data-test="event-type"] label').contains('Event Type').should('be.visible');
        cy.get('div[data-test="event-type"] a').contains('Speaker').should('be.visible');

        cy.get('div[data-test="organisation"] label').contains('Organized by').should('be.visible');
        cy.get('div[data-test="organisation"] a').contains('Model UN').should('be.visible');

        cy.get('div[data-test="event-type"] + div label').contains('Contacts').should('be.visible');
        cy.get('div[data-test="event-type"] + div span span').contains('Test User').should('be.visible');

        cy.get('#main-content h3').contains('Event Description').should('be.visible');
        cy.get('#main-content h3 + p').contains('QA Task Submission').should('be.visible');

    })
})