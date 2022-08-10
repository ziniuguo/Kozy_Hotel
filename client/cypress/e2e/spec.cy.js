function generateInput(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

console.log(generateInput(5));

describe('spec.cy.js', () => {
    it('passes', async () => {

        // testing OTP with random email address

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/OTP',
            body: {
                email: 'guo.ziniu.1003@gmail.com'
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(200);
            }
        );

        cy.wait(1000 * 31);

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/OTP',
            body: {
                email: 'ziniu_guo@mymail.sutd.edu.sg'
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(200);
            }
        );

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/OTP',
            body: {
                email: 'guo.ziniu.1003@gmail.com'
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(429);
            }
        );

        cy.wait(1000 * 31);

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/OTP',
            body: {
                email: generateInput(5)
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(500);
            }
        );

        cy.wait(1000 * 31);

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/OTP',
            body: {
                email: generateInput(5)
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(500);
            }
        );

        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/manage',
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(401);
            }
        );

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/authenticate',
            body: {
                email: "me@example.com",
                password: generateInput(5)
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(401);
            }
        );

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/authenticate',
            body: {
                email: generateInput(5),
                password: generateInput(5)
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(401);
            }
        );

        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/authenticate',
            body: {
                email: "me@example.com",
                password: "000000"
            },
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(200);
            }
        );

        cy.request({
            method: 'GET',
            url: 'http://localhost:5000/manage',
            failOnStatusCode: false
        }).then(
            (response) => {
                expect(response.status).to.eq(200);
            }
        );


    })
})
